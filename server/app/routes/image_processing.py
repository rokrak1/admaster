import cv2
import base64
import random
from fastapi import File, Request
from app.routers import protected_router

@protected_router.post("/get-preview/")
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