from fastapi import File, UploadFile, Request
from app.routers import protected_router

app_store = {
    "csv": None,
    "image": None,
    "settings": None,
}

@protected_router.post("/upload-csv/")
async def upload_csv(csv_file: UploadFile = File(...)):
    # Process CSV File
    content = await csv_file.read()
    content_decoded = content.decode('utf-8')

    csv_reader = csv.DictReader(io.StringIO(content_decoded), delimiter=';')
    csv_data = [row for row in csv_reader]

    app_store["csv"] = csv_data
    return {"message": "CSV file processed successfully"}