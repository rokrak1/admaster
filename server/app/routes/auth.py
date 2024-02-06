from fastapi import HTTPException, Depends, Request, APIRouter, Response
from typing import Optional
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import ORJSONResponse
from pydantic import BaseModel
from fastapi.encoders import jsonable_encoder

from app.routers import protected_router, public_router
from app.enums.response_codes import Response_codes
from app.supabase_client import supabase
from app.functions.auth import authenticate_user, get_user_data, set_session
from app.models.authentication import Login




# Register endpoint
@public_router.post("/register")
async def register(username: str, password: str):
    # Here, use Supabase functionality to create a new user
    result = supabase.auth.sign_up(email=username, password=password)
    if result.error:
        raise HTTPException(status_code=400, detail="Registration failed")
    return {"message": "User registered successfully"}

@public_router.post("/login")
async def login(data: Login, response: Response):
    [user, session] = await authenticate_user(data.email, data.password)

    if(user is None or session is None):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    
    user_data = await get_user_data(user.id)

    if(user_data is None):
        raise HTTPException(status_code=404, detail="User not found")   
    
    
    response = ORJSONResponse(content={"user": user_data, "message": "User logged in successfully"})
    response.set_cookie(key="refresh_token", value=session.refresh_token, httponly=True)
    response.set_cookie(key="access_token", value=session.access_token, httponly=True)

    return response

@protected_router.post("/logout")
async def logout(request: Request):
    return {"message": "User logged out successfully"}

@public_router.get("/me")
async def me(request: Request, response: Response):
    refresh_token = request.cookies.get("refresh_token")
    access_token = request.cookies.get("access_token")

    if not access_token and not refresh_token:
        raise HTTPException(status_code=401, detail={"message": "Unauthorized, no tokens found", "code": Response_codes.UNAUTHORIZED.value})

    [user, session] = await set_session(access_token, refresh_token)

    if(user is None or session is None):
        raise HTTPException(status_code=401, detail={"message": "Unauthorized, no user or session", "code": Response_codes.UNAUTHORIZED.value})
    
    print(user)
    user_data = await get_user_data(user.id)

    if(user_data is None):
        raise HTTPException(status_code=404, detail="User not found")

    response = ORJSONResponse(content={"user": user_data, "message": "User data retrieved successfully"})
    response.set_cookie("refresh_token", session.refresh_token, httponly=True)
    response.set_cookie("access_token", session.access_token, httponly=True)

    return response

