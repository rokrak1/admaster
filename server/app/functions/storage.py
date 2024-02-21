import pandas as pd
import hashlib
from io import BytesIO
import io

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
        print(f"An error occurred: {e}")

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
    # Merge the two DataFrames on 'id' to find common rows
    merged_df = pd.merge(new_df, existing_df, on='id', suffixes=('_new', '_existing'), how='outer', indicator=True)
    
    # Identify rows that are either updated or only exist in new_df
    updated_or_new = (merged_df['hash_new'] != merged_df['hash_existing']) | (merged_df['_merge'] == 'left_only')
    
    # TODO: fix id error 
    # For rows that are updated or new, take data from new_df
    merged_df.loc[updated_or_new, existing_df.columns] = merged_df.loc[updated_or_new, [col + '_new' for col in existing_df.columns]].values
    
    # Recompute hashes for updated or new rows
    columns_for_hashing = [col for col in new_df.columns if col != 'hash_new']  # Exclude the 'hash' column
    merged_df.loc[updated_or_new, 'hash_new'] = merged_df.loc[updated_or_new, columns_for_hashing].apply(generate_hash, axis=1)
    
    # Drop rows that only exist in existing_df and not in new_df
    merged_df = merged_df[merged_df['_merge'] != 'right_only']
    
    # Drop temporary columns and rename columns back
    merged_df.drop(columns=[col for col in merged_df.columns if '_new' in col or '_existing' in col or col == '_merge'], inplace=True)
    
    return merged_df