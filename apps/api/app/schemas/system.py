# 🔧 System Schemas
# Pydantic models for system-level API responses

from pydantic import BaseModel
from datetime import datetime


class ApiResponse(BaseModel):
    """Generic API response schema."""
    message: str


class HealthCheck(BaseModel):
    """Health check response schema."""
    status: str
    timestamp: datetime


class ErrorResponse(BaseModel):
    """Error response schema."""
    error: str
    detail: str | None = None


class SuccessResponse(BaseModel):
    """Success response schema."""
    success: bool = True
    message: str 