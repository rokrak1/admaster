from fastapi import HTTPException, Depends, Request, APIRouter, Response
from typing import Optional
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import ORJSONResponse
from app.routers import protected_router, public_router
from pydantic import BaseModel
from app.enums.response_codes import Response_codes

from app.supabase_client import supabase



# Register endpoint
@public_router.post("/register")
async def register(username: str, password: str):
    # Here, use Supabase functionality to create a new user
    result = supabase.auth.sign_up(email=username, password=password)
    if result.error:
        raise HTTPException(status_code=400, detail="Registration failed")
    return {"message": "User registered successfully"}

class Login(BaseModel):
    email: str
    password: str

@public_router.post("/login")
async def login(data: Login):
    
    try:
        user = supabase.auth.sign_in_with_password({"email": data.email, "password": data.password})
        try:
            user_data = supabase.table("users").select("*").eq("user_id", user["user"]["id"])
            return ORJSONResponse(content={"user": user_data})
        except:
            raise HTTPException(status_code=404, detail={"message": "User not found", "code": Response_codes.CONTACT_SUPPORT})
    except:
        raise HTTPException(status_code=400, detail={"message": "Incorrect email or password", "code": Response_codes.LOGIN_FALIURE})

@protected_router.post("/logout")
async def logout(request: Request):
    # Invalidate the token using Supabase's functionality
    # This usually requires storing and managing session tokens manually since Supabase
    # and similar services might not provide a direct way to invalidate tokens
    return {"message": "User logged out successfully"}

@protected_router.get("/me")
async def me(request: Request, response: Response):
    access_token = request.headers.get("Authorization", "").replace("Bearer ", "")
    refresh_token = request.cookies.get("refresh_token")

    # Authenticate using the access token & refresh token
    try:
        res = supabase.auth.set_session(access_token, refresh_token)
        user = res["user"]
        session = res["session"]
        
        # Fetch user data from the database
        try:
            user_data = supabase.table("users").select("*").eq("user_id", user["user"]["id"])
            response.set_cookie("refresh_token", session["refresh_token"], httponly=True)
            response.headers["Authorization"] = f"Bearer {session['access_token']}"
            return ORJSONResponse(content={"user": user_data})
        except:
            raise HTTPException(status_code=404, detail={"message": "User not found", "code": Response_codes.CONTACT_SUPPORT})
    except:
        raise HTTPException(status_code=400, detail={"message": "Invalid tokens", "code": Response_codes.INVALID_TOKEN})
