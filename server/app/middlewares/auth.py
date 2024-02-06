from fastapi import Depends, HTTPException, Request
from starlette.status import HTTP_403_FORBIDDEN
from app.functions.auth import set_session
import jwt
from jwt import DecodeError, ExpiredSignatureError
import os
from enum import Enum
from app.enums.response_codes import Response_codes

# Assuming supabase is initialized somewhere
from app.supabase_client import supabase

class TokenStatus(Enum):
    DECODED = "DECODED",
    EXPIRED = "EXPIRED",
    INVALID = "INVALID"

async def validate_access_token(request: Request):
    # Extract tokens from the request headers or cookies
    access_token = request.cookies.get("access_token")

    if not access_token:
        raise HTTPException(
            status_code=404,
            detail="Access token not found.",
        )
    
    [token_status, decoded] = token_decoder(access_token)
    
    if token_status == TokenStatus.EXPIRED.value:
        raise HTTPException(
            status_code=401,
            detail={"message":"Access token expired.", "code": Response_codes.REAUTHENTICATE.value},
        )
    elif token_status == TokenStatus.INVALID.value:
        raise HTTPException(
            status_code=403,
            detail="Invalid access token.",
        )
    if token_status == TokenStatus.DECODED.value:
        if not decoded["app_metadata"]:
            raise HTTPException(
                status_code=403,
                detail="Unauthorized access.",
            )
        if not decoded["app_metadata"]["customer_id"]:
            raise HTTPException(
                status_code=403,
                detail="Unauthorized access.",
            )
        request.state.customer_id = decoded["app_metadata"]["customer_id"]
        return True

    return False


def token_decoder(token: str):
    try:
        decoded = jwt.decode(token, os.environ.get("SUPABASE_JWT_SECRET"), algorithms=["HS256"], audience="authenticated")
        return [TokenStatus.DECODED.value, decoded]
    except jwt.InvalidAudienceError:
        return [TokenStatus.INVALID.value, None]
    except DecodeError:
        return [TokenStatus.INVALID.value, None]
    except ExpiredSignatureError:
        return [TokenStatus.EXPIRED.value, None]
    except:
        return [TokenStatus.INVALID.value, None]