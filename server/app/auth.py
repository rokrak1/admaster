from fastapi import Depends, HTTPException, Request
from starlette.status import HTTP_403_FORBIDDEN
import jwt

# Assuming supabase is initialized somewhere
from app.supabase_client import supabase

async def validate_access_token(request: Request):
    # Extract tokens from the request headers or cookies
    access_token = request.headers.get("Authorization", "").replace("Bearer ", "")

    if not access_token:
        raise HTTPException(
            status_code=HTTP_403_FORBIDDEN,
            detail="Access token not found.",
        )
    
    try:
        data = supabase.auth.get_user(access_token)
        if not data:
            raise HTTPException(
                status_code=HTTP_403_FORBIDDEN,
                detail="User not found.",
            )
        return True
    except:
        raise HTTPException(
            status_code=HTTP_403_FORBIDDEN,
            detail="Invalid access token.",
        )

    return False