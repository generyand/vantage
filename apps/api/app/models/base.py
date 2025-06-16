from pydantic import BaseModel
from typing import Optional


class ApiResponse(BaseModel):
    """Standard API response format"""
    message: str
    status: str = "success"
    data: Optional[dict] = None 