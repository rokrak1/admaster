from fastapi import FastAPI, File, UploadFile, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import cv2
import numpy as np
from io import BytesIO
from PIL import Image
import csv
import io
import numpy as np
import base64
import httpx
import random
import copy

class JsonData(BaseModel):
    # Define the structure of your JSON data here
    example_field: str

app = FastAPI()

origins = [
    "http://localhost:3000",  # Adjust to your frontend's URL
    # Add other frontend origins as needed
]

# Add middleware to the application
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app_store = {
    "csv": None,
    "image": None,
    "settings": None,
}

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/upload-csv/")
async def upload_csv(csv_file: UploadFile = File(...)):
    # Process CSV File
    content = await csv_file.read()
    content_decoded = content.decode('utf-8')

    csv_reader = csv.DictReader(io.StringIO(content_decoded), delimiter=';')
    csv_data = [row for row in csv_reader]

    app_store["csv"] = csv_data
    return {"message": "CSV file processed successfully"}

async def fetch_image(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:104.0) Gecko/20100101 Firefox/104.0'
    }

    async with httpx.AsyncClient(follow_redirects=True) as client:
        try:
            response = await client.get(url, headers=headers)
            response.raise_for_status()  # Will raise an HTTPError for unsuccessful status codes
            return response.content
        except httpx.HTTPError as e:
            print(f"HTTP error occurred: {e}")
        except Exception as e:
            print(f"An error occurred: {e}")

    return None



async def draw_items_on_image(bs_image, settings, random_number):
    base_image = copy.copy(bs_image)

    for item in settings:
        if item['type'] == 'text':
            x = int(item["attrs"].get('x', 0)) - 200
            y = int(item["attrs"].get('y', 0)) - 121 + int(item["attrs"].get('textHeight', 0)) - 5
            position = (x, y)
            var_id = item.get('varId', '')
            text = app_store["csv"][random_number][var_id]
            font_scale = 1  # Adjust as needed
            color = (0, 0, 0)  # Black color
            thickness = 2  # Adjust as needed
            cv2.putText(base_image, text, position, cv2.FONT_HERSHEY_SIMPLEX, font_scale, color, thickness)
            print("Base image dimensions after processing an item:", base_image.shape)

        elif item['type'] == 'image':
            var_id = item.get('varId', '')
            image_url = app_store["csv"][random_number][var_id]
            img_data = await fetch_image(image_url)

            # Check if img_data is not empty
            if not img_data:
                print(f"Failed to fetch image from URL: {image_url}")
                continue  # Skip this item and continue with the next

            img_array = np.frombuffer(img_data, np.uint8)
            if img_array.size == 0:
                print(f"No image data found at URL: {image_url}")
                continue  # Skip this item

            img = cv2.imdecode(img_array, cv2.IMREAD_UNCHANGED)
            if img is None:
                print(f"Failed to decode image from URL: {image_url}")
                continue  
            # Resize image
            w = int(item["attrs"].get('width', 0))
            h = int(item["attrs"].get('height', 0))
            img = cv2.resize(img, (w, h))

            # Extract scaling factors
            scale_x = item["attrs"].get('scaleX', 1)  # Default to 1 if scaleX is not present
            scale_y = item["attrs"].get('scaleY', 1)  # Default to 1 if scaleY is not present

            if scale_x:
                scale_x = float(scale_x)
                w = int(img.shape[1] * scale_x)
                img = cv2.resize(img, (w, img.shape[0]))
            
            if scale_y:
                scale_y = float(scale_y)
                h = int(img.shape[0] * scale_y)
                img = cv2.resize(img, (img.shape[1], h))

            if scale_x or scale_y:
                # Resize the image
                img = cv2.resize(img, (w, h))
            
            if img.shape[2] == 3:
                img = cv2.cvtColor(img, cv2.COLOR_RGB2RGBA)

            top_border = 2    # The number of pixels for the top border
            bottom_border = 2 # The number of pixels for the bottom border
            left_border = 2   # The number of pixels for the left border
            right_border = 2  # The number of pixels for the right border
            border_color = (255, 0, 0) 
            img_with_border = cv2.copyMakeBorder(img, top_border, bottom_border, left_border, right_border, cv2.BORDER_CONSTANT, value=border_color)

            # Ensure that the coordinates and dimensions fit within the base_image
            x = int(item["attrs"].get('x', 0)) - 200
            y = int(item["attrs"].get('y', 0)) - 121
            base_image[y:y+h, x:x+w] = img

    return base_image

@app.post("/get-preview/")
async def upload_image_settings(request: Request):
    data = await request.json()

    base64_image = data.get("image")
    settings = data.get("settings")

    # Decode base64 image to OpenCV format
    if base64_image.startswith("data:image"):
    # Split the string on the first comma and take the second part
        base64_image = base64_image.split(",", 1)[1]

    if base64_image is None:
        return {"message": "No image data provided"}

    img_data = base64.b64decode(base64_image)
    img_array = np.frombuffer(img_data, np.uint8)
    base_image = cv2.imdecode(img_array, cv2.IMREAD_UNCHANGED)

    # Create a list to store the results
    some_results = []

    # Number of iterations (10 in this case)
    num_iterations = 10

    for _ in range(num_iterations):
        # Generate a random number between 0 and 100
        random_number = random.randint(0, 100)
        
        # Call draw_items_on_image with the random number as an additional parameter
        result_image = await draw_items_on_image(base_image, settings, random_number)
        
        # Convert the image to JPEG format
        _, img_data = cv2.imencode(".jpg", result_image)
        img_base64 = base64.b64encode(img_data).decode("utf-8")
        # Append the result (JPEG data) and the random number to the list
        some_results.append(img_base64)

    # Save or return the image
    # cv2.imwrite('output.png', result_image)  # Save the image

    # Now you can return 'jpeg_image' to the frontend
    response_data = {
        "images": some_results,  # Use the list of JPEG data directly
    }

    return JSONResponse(content=response_data)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
