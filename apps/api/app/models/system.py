from pydantic import BaseModel
from datetime import datetime

 
class HealthCheck(BaseModel):
    """Health check response model"""
    status: str
    timestamp: datetime 