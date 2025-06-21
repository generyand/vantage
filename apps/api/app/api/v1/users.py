# 👥 Users API Routes
# Endpoints for user management and user information

from fastapi import APIRouter
from datetime import datetime

from app.schemas.user import User

router = APIRouter()


@router.get("/me", response_model=User, tags=["users"])
async def get_current_user():
    """
    Get current user information.
    
    In production, this will:
    1. Extract user ID from JWT token
    2. Query user data from database
    3. Return user profile information
    """
    # TODO: Replace with actual user retrieval logic
    # - Extract user from JWT token dependency
    # - Query user from database by ID
    # - Handle user not found cases
    
    return User(
        id="user-123",
        email="user@example.com", 
        name="John Doe",
        created_at=datetime.now()
    ) 