from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class User(BaseModel):
    """User model"""
    id: str
    email: str
    name: str
    created_at: datetime


class UserCreate(BaseModel):
    """Schema for creating a new user"""
    email: str
    name: str


class UserUpdate(BaseModel):
    """Schema for updating user information"""
    email: Optional[str] = None
    name: Optional[str] = None 