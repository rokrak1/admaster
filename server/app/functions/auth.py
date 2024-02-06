from fastapi import HTTPException
from app.supabase_client import supabase
from app.models.authentication import User, Session
from app.enums.response_codes import Response_codes

async def authenticate_user(email: str, password: str):
    try:
        result = supabase.auth.sign_in_with_password({"email": email, "password": password})

        user = result.user
        session = result.session
        return [user, session]
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def set_session(access_token: str, refresh_token: str):
    try:
        response = supabase.auth.set_session(access_token, refresh_token)
        user = response.user
        session = response.session
        return [user, session]
    except Exception as e:
        print(e)
        raise HTTPException(status_code=404, detail={"message": "User not found", "code": Response_codes.CONTACT_SUPPORT.value})

async def get_user_data(user_id: str):
    try:
        user_data = supabase.table("customer").select("*").eq("user_id", user_id).single().execute()
        if not user_data.data:
            raise ValueError("User not found.")
        return user_data.data
    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail="User data retrieval failed",
            )