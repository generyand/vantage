from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class Project(BaseModel):
    """Project model"""
    id: str
    name: str
    description: Optional[str] = None
    owner_id: str
    created_at: datetime


class ProjectCreate(BaseModel):
    """Schema for creating a new project"""
    name: str
    description: Optional[str] = None


class ProjectList(BaseModel):
    """Schema for project list response"""
    projects: List[Project]
    total: int 