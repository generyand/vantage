# 🔐 Token & Authentication Schemas
# Pydantic models for authentication-related API requests and responses

from pydantic import BaseModel


class LoginRequest(BaseModel):
    """Schema for user login request."""
    email: str
    password: str


class AuthToken(BaseModel):
    """Schema for authentication token response."""
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class Token(BaseModel):
    """Standard token response schema."""
    access_token: str
    token_type: str


class TokenPayload(BaseModel):
    """Schema for token payload data."""
    sub: str | None = None 