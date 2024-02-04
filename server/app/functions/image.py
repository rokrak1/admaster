import httpx
import copy
import time
import numpy as np
import csv
from PIL import Image
from pydantic import BaseModel, Field
import cv2

async def fetch_image(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:104.0) Gecko/20100101 Firefox/104.0'
    }

    async with httpx.AsyncClient(follow_redirects=True) as client:
        start_time = time.perf_counter()  # Start the timer

        try:
            response = await client.get(url, headers=headers)
            response.raise_for_status()  # Will raise an HTTPError for unsuccessful status codes
            
            end_time = time.perf_counter()  # End the timer
            print(f"Request completed in {end_time - start_time:.2f} seconds")  # Print the time taken

            return response.content
        except httpx.HTTPError as e:
            print(f"HTTP error occurred: {e}")
        except Exception as e:
            print(f"An error occurred: {e}")

        end_time = time.perf_counter()  # End the timer even in case of an exception
        print(f"Request completed in {end_time - start_time:.2f} seconds")  # Print the time taken

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