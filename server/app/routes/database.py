from fastapi import File, UploadFile, Request
from app.routers import protected_router, public_router
from app.functions.storage import hash_csv, save_csv_to_storage, check_csv_exists, compare_data_frames_and_return_new
from app.config.ftp import create_ftp_connection
from io import StringIO


app_store = {
    "csv": None,
    "image": None,
    "settings": None,
}

@public_router.post("/upload-csv/")
async def upload_csv(csv_file: UploadFile = File(...)):

    # Create an FTP connection
    with create_ftp_connection() as ftp:
        if ftp is None:
            print("FTP connection is not established.")
            return {"message": "Failed to connect to the FTP server."}

        # Hash the CSV file
        csv_data = None
        try:
            content = csv_file.file.read().decode('utf-8')
            csv_data = StringIO(content)
        except Exception as e:
            print(f"An error occurred: {e}")

        if not csv_data:
            return {"message": "Failed to process the CSV file."}

        hashed_csv = hash_csv(csv_data)

        # Check if CSV exists and compare data
        csv_from_storage = check_csv_exists(ftp)

        if csv_from_storage is not None:
            hashed_csv = compare_data_frames_and_return_new(hashed_csv, csv_from_storage)

        # Save the CSV file to the FTP server
        try:
            save_csv_to_storage(hashed_csv, ftp, "hashed_data_feed.csv")
        except Exception as e:
            print(f"An error occurred: {e}")
            return {"message": "Failed to save the CSV file to the FTP server."}

    return {"message": "CSV file processed successfully"}