from typing import List, Optional, Dict
from pydantic import BaseModel, EmailStr, UUID4
from datetime import datetime

class Login(BaseModel):
    email: str
    password: str

class UserIdentity(BaseModel):
    id: UUID4
    user_id: UUID4
    identity_data: Dict[str, str]  # Adjust according to the actual structure
    provider: str
    created_at: datetime
    last_sign_in_at: datetime
    updated_at: datetime

class User(BaseModel):
    id: UUID4
    app_metadata: Dict[str, List[str]]
    user_metadata: Dict[str, str]
    aud: str
    confirmation_sent_at: Optional[datetime] = None
    recovery_sent_at: Optional[datetime] = None
    email_change_sent_at: Optional[datetime] = None
    new_email: Optional[EmailStr] = None
    invited_at: Optional[datetime] = None
    action_link: Optional[str] = None
    email: EmailStr
    phone: Optional[str] = None
    created_at: datetime
    confirmed_at: datetime
    email_confirmed_at: datetime
    phone_confirmed_at: Optional[datetime] = None
    last_sign_in_at: datetime
    role: str
    updated_at: datetime
    identities: List[UserIdentity]
    factors: Optional[List[str]] = None

class Session(BaseModel):
    provider_token: Optional[str] = None
    provider_refresh_token: Optional[str] = None
    access_token: str
    refresh_token: str
    expires_in: int
    expires_at: int  # Assuming this is a timestamp; consider using datetime if appropriate
    token_type: str
    user: User

# Example of how to use these models in a FastAPI endpoint
from fastapi import FastAPI

app = FastAPI()

@app.post("/login", response_model=Session)
async def login():
    # Your login logic here
    # For demonstration, returning a mock object
    return Session(...)
