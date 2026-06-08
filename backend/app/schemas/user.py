from pydantic import BaseModel, EmailStr
from typing import Optional

class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str

class ProfileUpdate(BaseModel):
    name: str
    phone: Optional[str] = None
    location: Optional[str] = None
    skills: Optional[str] = None

class ProfileResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str] = None
    location: Optional[str] = None
    skills: Optional[str] = None
    profile_image: Optional[str] = None

    class Config:
        from_attributes = True