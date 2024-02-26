import pandas as pd
import hashlib
from io import BytesIO
import io
import numpy as np
import concurrent.futures
import requests
import os

def generate_hash(row):
    # Create a string representation of the row
    row_str = row.astype(str).str.cat(sep='|')
    # Return the SHA-256 hash of the row
    return hashlib.sha256(row_str.encode()).hexdigest()

def hash_csv(csv_file):
    # Process CSV File
    df=None
    try:
        df = pd.read_csv(csv_file, sep=';', quotechar='"')
    except pd.errors.ParserError as e:
        print(f"Hashing csv error: {e}")

    # Apply the function to each row to create a new 'hash' column
    df['hash'] = df.apply(generate_hash, axis=1)
    return df

def save_csv_to_storage(df, ftp, filename):
    # Change to the 'user_files' directory
    ftp.cwd('user_files')
    # Convert the DataFrame to a CSV string
    csv_buffer = BytesIO()
    df.to_csv(csv_buffer, index=False, sep=';', quotechar='"')
    csv_buffer.seek(0)  # Rewind the buffer to the beginning

    # Upload the file
    ftp.storbinary(f'STOR {filename}', csv_buffer)

def download_csv_and_load_into_dataframe(ftp, filename):
    """
    Download the CSV file from the FTP server and load it into a pandas DataFrame

    Args:
    - ftp: FTP object
    - filename: str

    Returns:
    DataFrame or None
    """
    csv_buffer = io.BytesIO()
    
    ftp.retrbinary(f'RETR {filename}', csv_buffer.write)

    if csv_buffer.tell() == 0:
        return None
    
    # Move the buffer's position to the start
    csv_buffer.seek(0)
    
    df = pd.read_csv(csv_buffer, sep=";", quotechar='"')
    return df

def check_csv_exists(ftp):
    """
    Check if the hashed CSV file exists on the FTP server

    Args:
    - ftp: FTP object

    Returns:
    DataFrame or None
    """
    hashed_csv_filename = "hashed_data_feed.csv"
    user_files = "user_files"
    files = ftp.nlst(user_files)
    exists = hashed_csv_filename in files

    df = None
    if exists:
        df = download_csv_and_load_into_dataframe(ftp,user_files + "/" + hashed_csv_filename)
    else:
        return None

    if df is None:
        return None

    return df

def compare_data_frames_and_return_new(new_df, existing_df):
    # Merge the two DataFrames on 'id' to find common rows, indicating the source of each row
    merged_df = pd.merge(new_df, existing_df, on='id', suffixes=('_new', '_old'), how='outer', indicator=True)

    original_columns = [col for col in new_df.columns if col != 'id']

    # New rows
    new_rows = merged_df[merged_df['_merge'] == 'left_only']
    new_rows_cleaned = new_rows[['id'] + [f'{col}_new' for col in original_columns]]
    new_rows_cleaned.columns = ['id'] + original_columns
    
    # Removed rows
    removed_rows = merged_df[merged_df['_merge'] == 'right_only']
    removed_rows_cleaned = removed_rows[['id'] + [f'{col}_old' for col in original_columns]]
    removed_rows_cleaned.columns = ['id'] + original_columns

    # Updated row
    updated_rows = merged_df[(merged_df['_merge'] == 'both') & (merged_df['hash_new'] != merged_df['hash_old'])]
    updated_rows_cleaned = updated_rows[['id'] + [f'{col}_new' for col in original_columns]]
    updated_rows_cleaned.columns = ['id'] + original_columns

    # Rows with new image URLs
    updated_rows_new_urls = updated_rows[updated_rows['image_link_new'] != updated_rows['image_link_old']]
    updated_rows_new_urls_cleaned = updated_rows_new_urls[['id'] + [f'{col}_new' for col in original_columns if col != 'image_link'] + ['image_link_new']]
    updated_rows_new_urls_cleaned.columns = ['id'] + [col for col in original_columns if col != 'image_link'] + ['image_link']


    updated_rows = {
        "new": new_rows_cleaned,
        "removed": removed_rows_cleaned,
        "updated": updated_rows_cleaned,
        "updated_new_urls": updated_rows_new_urls_cleaned
    }
    return new_df, updated_rows

def fetch_image_content(row: pd.Series):
    image_url = row['image_link']
    try:
        response = requests.get(image_url, stream=True, timeout=(10, 30))
        if response.status_code == 200:
            # TODO REMOVE BACKGROUND FROM IMAGE IF WHITE
            row['image_content'] = response.content
            return row, True
        else:
            print(f"Failed to download {image_url}: Status code {response.status_code}")
            return None, False
    except Exception as e:
        print(f"Failed to download {image_url}: {e}")
        raise ValueError(f"Error downloading {image_url}: {e}")

def batch_fetch_images(rows, n_jobs=8):
    """Yield image content as images are fetched."""
    with concurrent.futures.ThreadPoolExecutor(max_workers=n_jobs) as executor:
        # Submit tasks to fetch image content
        print("oask1")
        future_to_url = {executor.submit(fetch_image_content, row): row for index, row in rows.iterrows()}

        
        # As tasks complete, yield the image content
        for future in concurrent.futures.as_completed(future_to_url):
            print("oask2")
            response = future_to_url[future]
            try:
                new_row, is_valid = future.result()
                if is_valid:
                    yield new_row, True
                else:
                    print(f"Failed to fetch image from {response['image_link']}")
            except Exception as exc:
                print(f"{response['image_link']} generated an exception: {exc}")

def batch_download_images_to_cdn(rows, ftp):
    for new_row, is_valid in batch_fetch_images(rows, n_jobs=8):
        if is_valid:
            save_to_storage(new_row, ftp)

def save_to_storage(row: pd.Series, ftp):
    image_content = row['image_content']
    image_id = row['id'].replace("/", "_")
    image_url = row['image_link']
    image_extension = os.path.splitext(image_url)[1] 
    filename = f"{image_id}{image_extension}"
    print(f"Saving image {filename} to storage.")
    try:
        # TODO ADD USER FOLDER BASED ON ID AND DATA_FOLDER
        ftp.storbinary(f'STOR {filename}', BytesIO(image_content))
    except Exception as e:
        print(f"Save to storage error: {e}")

def remove_cached_images(removed_rows, ftp):
    """Remove images from the FTP server for removed rows."""
    # Iterate over the rows and remove the images from the FTP server.
    for index, row in removed_rows.iterrows():
        image_id = row['id'].replace("/", "_")
        image_url = row['image_link']
        image_extension = os.path.splitext(image_url)[1] 
        filename = f"{image_id}{image_extension}"
        try:
            # TODO ADD USER FOLDER BASED ON ID AND DATA FOLDER
            ftp.delete(filename)
        except Exception as e:
            print(f"Save to storage error: {e}")