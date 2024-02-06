from fastapi import FastAPI, Depends, HTTPException, APIRouter, Security, Depends
from fastapi.security import OAuth2PasswordBearer
from starlette.status import HTTP_401_UNAUTHORIZED
from app.middlewares.auth import validate_access_token

print("TEST")

# Router for routes that do not require authentication
public_router = APIRouter()

# Router for routes that require authentication
protected_router = APIRouter(dependencies=[Depends(validate_access_token)])
