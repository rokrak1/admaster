from fastapi import File, UploadFile, Request
from fastapi.responses import JSONResponse
from app.routers import protected_router, public_router
from app.functions.storage import hash_csv, save_csv_to_storage, check_csv_exists, compare_data_frames_and_return_new, batch_download_images_to_cdn
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
            return JSONResponse(content={"message": "Failed to connect to the FTP server."})

        # Hash the CSV file
        csv_data = None
        try:
            content = csv_file.file.read().decode('utf-8')
            csv_data = StringIO(content)
        except Exception as e:
            print(f"Reading csv error: {e}")
            JSONResponse(content={"message": "Failed to process the CSV file."})

        if not csv_data:
            return JSONResponse(content={"message": "Failed to process the CSV file."})

        hashed_csv = hash_csv(csv_data)
        # Check if CSV exists and compare data
        csv_from_storage = check_csv_exists(ftp)

        updated_rows = None
        if csv_from_storage is not None:
            try:
                hashed_csv, updated_rows = compare_data_frames_and_return_new(hashed_csv, csv_from_storage)
            except Exception as e:
                print(f"Compare dataframes error: {e}")
                return JSONResponse(content={"message": "Failed to compare the CSV data."})
        
        print("err1")
        # Remove old images or create new ones
        if updated_rows is not None:
            if updated_rows["removed"]:
                remove_cached_images(updated_rows["removed"], ftp)
            if updated_rows["new"]:
                batch_download_images_to_cdn(updated_rows["new"], ftp)
            if updated_rows["updated_new_urls"]:
                batch_download_images_to_cdn(updated_rows["updated_new_urls"], ftp)
        else:
            batch_download_images_to_cdn(hashed_csv, ftp)
       
        # Save the CSV file to the FTP server
        try:
            save_csv_to_storage(hashed_csv, ftp, "hashed_data_feed.csv")
        except Exception as e:
            print(f"Save csv to storage error: {e}")
            return JSONResponse(content={"message": "Failed to save the CSV file to the FTP server."})

    return JSONResponse(content={"message": "CSV file processed successfully"})