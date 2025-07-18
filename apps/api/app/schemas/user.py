# 👥 User Schemas
# Pydantic models for user-related API requests and responses

from pydantic import BaseModel
from datetime import datetime


class User(BaseModel):
    """User response model for API endpoints."""
    id: str
    email: str
    name: str
    role: str
    created_at: datetime


class UserCreate(BaseModel):
    """Schema for creating a new user."""
    email: str
    name: str
    password: str
    role: str = "BLGU User"
    phone_number: str | None = None
    barangay_id: int | None = None


class UserUpdate(BaseModel):
    """Schema for updating user information."""
    email: str | None = None
    name: str | None = None
    role: str | None = None
    phone_number: str | None = None
    barangay_id: int | None = None


class UserInDB(User):
    """User model as stored in database (includes sensitive fields)."""
    hashed_password: str
    is_active: bool = True
    is_superuser: bool = False
    must_change_password: bool = True
    phone_number: str | None = None
    barangay_id: int | None = None 