import httpx
import copy
import time
import numpy as np
import pandas as pd
import csv
from PIL import Image, ImageDraw
from pydantic import BaseModel, Field
import cv2
import os
from app.utils.logger import logger
from app.models.image_processing import CanvasData
import base64
import re



csv_data = None

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

def read_csv_and_convert_to_dict(file_path: str, delimiter: str = ';'):
    # Load the CSV file directly from the specified path
    df = pd.read_csv(file_path, delimiter=delimiter)
    
    # Convert the DataFrame to a list of dictionaries
    data_as_dict = df.to_dict('records')
    
    return data_as_dict

async def draw_items_on_image(bs_image, settings, random_number):
    global csv_data
    if not csv_data:
        script_dir = os.path.dirname(os.path.abspath(__file__))
        os.chdir(script_dir)
        file_path = './fbfeed.csv' 
        csv_data = read_csv_and_convert_to_dict(file_path)

def hex_to_bgr(hex_color):
    """Convert a hex color to BGR format."""
    hex_color = hex_color.lstrip('#')  # Remove '#' if present
    # Convert hex to BGR
    b = int(hex_color[0:2], 16)
    g = int(hex_color[2:4], 16)
    r = int(hex_color[4:6], 16)
    return (b, g, r)


def create_frame(width, height, fill, opacity):
    # Convert fill color from hex to BGR
    bgr_color = hex_to_bgr(fill)

    # Create an image with the background color
    frame = np.zeros((height, width, 3), dtype=np.uint8)
    frame[:] = bgr_color  # Fill the frame with the background color

    # If opacity is less than 1, blend the frame with a black background
    if opacity < 1:
        # Create a black background
        background = np.zeros((height, width, 3), dtype=np.uint8)
        # Blend the frame with the background based on the opacity
        frame = cv2.addWeighted(frame, opacity, background, 1-opacity, 0)

    return frame

def order_items_by_zindex(texts, images):
    # Merge all items into a single list
    all_items = texts + images
    
    # Update: Proper check for the presence and value of zIndex
    for item in all_items:
        # Check if 'zIndex' is either not present or explicitly set to None
        if getattr(item, 'zIndex', None) is None:
            logger.warning(f"Item without zIndex found: {item}")
            item.zIndex = 0  # Set zIndex to 0 if it's missing or None

    # Now sort the items by zIndex, assuming all items have a valid zIndex at this point
    ordered_items = sorted(all_items, key=lambda x: x.zIndex)
    
    return ordered_items


def text_to_image(text, font_path, font_size, text_color=(255, 255, 255), bg_color=(0, 0, 0, 0)):
    # Load the custom font
    font = ImageFont.truetype(font_path, font_size)
    
    # Create an image with transparent background
    image = Image.new("RGBA", font.getsize(text), bg_color)
    draw = ImageDraw.Draw(image)
    
    # Draw the text
    draw.text((0, 0), text, font=font, fill=text_color)
    
    return image

def overlay_text_image(frame, text_img_cv2, x, y):
    # Text image dimensions
    img_height, img_width = text_img_cv2.shape[:2]

    # Frame dimensions
    frame_height, frame_width = frame.shape[:2]

    # Calculate the overlay region, taking clipping into account
    start_x, start_y = max(x, 0), max(y, 0)
    end_x, end_y = min(x + img_width, frame_width), min(y + img_height, frame_height)

    # Calculate the region of interest in the text image considering the frame boundaries
    text_img_roi = text_img_cv2[max(0, -y):end_y-y, max(0, -x):end_x-x]

    if start_x < end_x and start_y < end_y:  # Check if there's an overlap
        frame[start_y:end_y, start_x:end_x] = text_img_roi

    return frame

def pil_to_cv2(pil_image):
    # Convert a PIL Image to an OpenCV image
    open_cv_image = np.array(pil_image)
    # Convert RGB to BGR
    return open_cv_image[:, :, ::-1].copy()

def overlay_with_transparency(frame, overlay, position):
    x, y = position
    overlay_height, overlay_width = overlay.shape[:2]

    # Background and foreground extraction for overlay
    bg = frame[y:y+overlay_height, x:x+overlay_width]
    alpha_mask = overlay[:, :, 3] / 255.0
    overlay = cv2.cvtColor(overlay[:, :, :3], cv2.COLOR_RGBA2BGR)

    # Ensure alpha mask dimensions match
    alpha_mask = alpha_mask[:,:,np.newaxis]

    # Combine background and foreground based on alpha mask
    combined = bg * (1 - alpha_mask) + overlay * alpha_mask
    frame[y:y+overlay_height, x:x+overlay_width] = combined.astype(np.uint8)

def draw_text_intelligently(frame, text, position, font, font_scale, color, thickness, font_path=None):
    x, y = position
    frame_height, frame_width = frame.shape[:2]

    # Convert color from hex to BGR
    color_bgr = hex_to_bgr(color)

    # Estimate text size with OpenCV
    (text_width, text_height), baseline = cv2.getTextSize(text, font, font_scale, thickness)
    text_bottom_right_x = x + text_width
    text_bottom_right_y = y + text_height

    # Check if text fits within frame boundaries
    if 0 <= x <= frame_width and 0 <= y <= frame_height and text_bottom_right_x <= frame_width and text_bottom_right_y <= frame_height:
        # Text fits within frame, use OpenCV's putText
        print(text, x, y, font, font_scale, color_bgr, thickness)
        cv2.putText(frame, text, (int(x), int(y + text_height)), font, 1, color_bgr, thickness)
    else:
        # Text exceeds frame or custom font needed, check for font_path
        if not font_path:
            # Define a default font if no custom font path is provided
            # This is a fallback scenario; you might need to ensure you have a reasonable default font
            current_dir = os.path.dirname(__file__)  # Get the directory where the script is located
            font_path = os.path.join(current_dir, '..', 'utils', 'fonts', 'roboto_regular.ttf')

            
        # Use PIL to render text as an image for more complex handling
        pil_text_image = text_to_image(text, font_path, int(font_scale * 20), color, (0, 0, 0, 0))  # Adjust scale as needed
        cv_text_image = pil_to_cv2(pil_text_image)
        overlay_with_transparency(frame, cv_text_image, (max(x, 0), max(y, 0)))

    return frame


# Decode base64 to image
def decode_base64_to_image(data_url):
    # Find and remove the MIME type and encoding header (e.g., "data:image/png;base64,")
    header, base64_data = re.split(',', data_url, maxsplit=1)
    
    # Decode the base64 string
    img_data = base64.b64decode(base64_data)
    
    # Convert the bytes data to a NumPy array
    np_arr = np.frombuffer(img_data, dtype=np.uint8)
    
    # Decode the NumPy array into an image
    img = cv2.imdecode(np_arr, cv2.IMREAD_UNCHANGED)
    
    return img

def has_alpha_channel(img):
    # Check if the image has three dimensions (H, W, C) and the number of channels (C) is 4
    return img.ndim == 3 and img.shape[2] == 4


def blend_images_with_alpha(frame, overlay_img, start_x, start_y, end_x, end_y):
    """
    Blend an overlay image with an alpha channel onto a background frame.

    Args:
    - frame: Background image as a NumPy array.
    - overlay_img: Overlay image as a NumPy array (must have an alpha channel).
    - start_x, start_y: Top-left coordinates on the frame where the overlay begins.
    - end_x, end_y: Bottom-right coordinates on the frame where the overlay ends.
    """
    # Calculate the size of the overlay
    overlay_height = end_y - start_y
    overlay_width = end_x - start_x

    # Resize overlay to fit the designated area if necessary
    if (overlay_width, overlay_height) != overlay_img.shape[1::-1]:
        overlay_img = cv2.resize(overlay_img, (overlay_width, overlay_height), interpolation=cv2.INTER_AREA)

    # Extract the alpha mask and color channels of the overlay image
    alpha_mask = overlay_img[:, :, 3] / 255.0
    overlay_color = overlay_img[:, :, :3]

    # Extract the region of interest (ROI) from the background frame
    frame_roi = frame[start_y:end_y, start_x:end_x]

    # Perform the blending by combining the ROI with the overlay image based on the alpha mask
    blended_roi = (1.0 - alpha_mask[..., np.newaxis]) * frame_roi + alpha_mask[..., np.newaxis] * overlay_color

    # Place the blended ROI back into the original frame
    frame[start_y:end_y, start_x:end_x] = blended_roi.astype(np.uint8)


def draw_image_with_clipping(frame, img, image_settings):
    # Frame dimensions
    frame_height, frame_width = frame.shape[:2]
    
    # Extract image settings
    x, y = int(round(image_settings.x)), int(round(image_settings.y))
    img_height, img_width = img.shape[:2]
    
    # Calculate the overlay image's end positions based on its dimensions
    overlay_end_x = x + img_width
    overlay_end_y = y + img_height
    
    # Calculate actual start and end positions for overlay on the frame
    start_x = max(x, 0)
    start_y = max(y, 0)
    end_x = min(overlay_end_x, frame_width)
    end_y = min(overlay_end_y, frame_height)
    
    # Calculate the region of the overlay image to use
    overlay_start_x = max(-x, 0)
    overlay_start_y = max(-y, 0)
    overlay_end_x = img_width - max(overlay_end_x - frame_width, 0)
    overlay_end_y = img_height - max(overlay_end_y - frame_height, 0)
    
    # Ensure there's something to draw
    if start_x >= end_x or start_y >= end_y or overlay_start_x >= overlay_end_x or overlay_start_y >= overlay_end_y:
        return frame  # Nothing to draw, as the image is completely outside the frame

    # Extract the relevant part of the overlay image
    img_roi = img[overlay_start_y:overlay_end_y, overlay_start_x:overlay_end_x]
    
    # Blending or direct overlay based on alpha
    if has_alpha_channel(img):
        blend_images_with_alpha(frame, img_roi, start_x, start_y, end_x, end_y)
    else:
        # Directly overlay the extracted ROI onto the frame
        frame[start_y:end_y, start_x:end_x] = img_roi

    return frame



def draw_image(frame, item):
    # Decode the base64 image string to an OpenCV image
    img = decode_base64_to_image(item.image)
    draw_image_with_clipping(frame, img, item)

def draw_text(frame, item):
    draw_text_intelligently(frame, item.text, (item.x, item.y), cv2.FONT_HERSHEY_SIMPLEX, 1, item.fill, 1, None)


def draw_items_on_frame(frame, items):
    for item in items:
        if item.type == 'text':
            draw_text(frame, item)
        elif item.type == 'image':
            draw_image(frame, item)
        else:
            print(f"No draw function for type: {item.type}")

    return frame

def generate_image_from_canvas_data(canvas_data: CanvasData) -> str:
    # Here, you would use the functions you've defined to create an image based on the canvas data
    
    # Create the initial frame based on canvas size and background settings
    frame = create_frame(
        width=int(canvas_data.frame.width),  # Adjusted from canvas_data.width
        height=int(canvas_data.frame.height),  # Adjusted from canvas_data.height
        fill=canvas_data.frame.fill,  # Adjusted from canvas_data.fill
        opacity=canvas_data.frame.opacity  # Adjusted from canvas_data.opacity
    )
    print("Frame done...")

    # Sort and draw all items on the frame
    items = order_items_by_zindex(canvas_data.text, canvas_data.image)
    print("Items ordered...")
    frame = draw_items_on_frame(frame, items)
    print("Items drawn...")
    # Convert the frame to a base64 string to return
    _, buffer = cv2.imencode('.jpg', frame)
    image_base64 = base64.b64encode(buffer).decode('utf-8')

    return image_base64