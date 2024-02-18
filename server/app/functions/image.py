import httpx
import copy
import time
import numpy as np
import pandas as pd
import csv
from PIL import Image, ImageDraw, ImageFont
from pydantic import BaseModel, Field
import cv2
import os
from app.utils.logger import logger
from app.models.image_processing import CanvasData
import base64
import re
import freetype

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
    if not isinstance(hex_color, str):
        raise TypeError("hex_color must be a string")
    
    hex_color = hex_color.lstrip('#')  # Remove '#' if present
    if len(hex_color) != 6:
        raise ValueError("hex_color must be a 6-character string representing RGB hex color")

    # Convert hex to BGR
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))


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


def get_files_dict():
    files_dict = {}
    folder_path = os.path.join(os.path.dirname(__file__), '..', 'utils', 'fonts')
    for file_name in os.listdir(folder_path):
        if os.path.isfile(os.path.join(folder_path, file_name)):
            file_name_without_ext, file_ext = os.path.splitext(file_name)
            files_dict[file_name_without_ext] = file_name
    return files_dict

dict_of_files = get_files_dict()

def draw_text(frame, item):
    x, y = (item.x, item.y)
    text = item.text
    font_scale = item.scaleX if item.scaleX else 1
    font_name = item.fontFamily.replace("'", "")
    color = item.fill
    frame_height, frame_width = frame.shape[:2]
    print("fname:",font_name)
    path_name_font = dict_of_files.get(font_name)

    if path_name_font:
        font_path = os.path.join(os.path.dirname(__file__), '..', 'utils', 'fonts', path_name_font )
        print("fpath",font_path)
    else:
        font_path = None   
    # Convert color from hex to BGR
    color_bgr = hex_to_bgr(color)

    if not font_path:
        current_dir = os.path.dirname(__file__)  # Get the directory where the script is located
        font_path = os.path.join(current_dir, '..', 'utils', 'fonts', 'roboto_regular.ttf')

    cv2.imwrite('frame_before.jpg', frame)
    frame = draw_text_with_pil(frame, text, (x, y), font_path, 20, color_bgr)
    cv2.imwrite('frame_after.jpg', frame)
    return frame


def draw_text_with_pil(frame, text, position, font_path, font_size, color):
    # Convert the BGR frame to RGB for Pillow
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    image = Image.fromarray(frame_rgb)
    
   
    # Ensure the image is in RGBA to handle transparency
    if image.mode != 'RGBA':
        image = image.convert('RGBA')
    
    draw = ImageDraw.Draw(image)
    font = ImageFont.truetype(font_path, font_size)
    draw.text(position, text, fill=(0,0,0), font=font)
    image.save('test2.png')
    
    cv2_im_processed = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
    return cv2_im_processed

# Decode base64 to image
def decode_base64_to_image(data_url):
    header, base64_data = re.split(',', data_url, maxsplit=1)
    img_data = base64.b64decode(base64_data)

    np_arr = np.frombuffer(img_data, dtype=np.uint8)
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


def draw_items_on_frame(frame, items):
    print(items)
    for item in items:
        if item.type == 'text':
            frame = draw_text(frame, item)
        elif item.type == 'image':
            frame = draw_image(frame, item)
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