import cv2
import base64
import random
import numpy as np
from fastapi import File, Request, HTTPException
from fastapi.responses import JSONResponse
from app.routers import protected_router
from app.functions.image import generate_image_from_canvas_data
from app.models.image_processing import CanvasData

@protected_router.post("/get-preview")
async def upload_image_settings(canvas_data: CanvasData):
    try:
        image_base64 = generate_image_from_canvas_data(canvas_data)
        
        # Prepare the response data
        response_data = {
            "image": image_base64,
            "message": "Image generated successfully."
        }
    except Exception as e:
        # Handle errors and exceptions
        raise HTTPException(status_code=500, detail=str(e))

    return JSONResponse(content=response_data)