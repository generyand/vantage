from pydantic import BaseModel


class LoginRequest(BaseModel):
    """Schema for user login request"""
    email: str
    password: str


class AuthToken(BaseModel):
    """Authentication token response"""
    access_token: str
    token_type: str = "bearer"
    expires_in: int 