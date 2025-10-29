# 🔐 FastAPI Dependencies
# Reusable dependency injection functions for authentication, database sessions, etc.

from typing import Generator, Optional

from app.core.security import verify_token
from app.db.base import get_db as get_db_session
from app.db.base import get_supabase, get_supabase_admin
from app.db.enums import UserRole
from app.db.models.user import User
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session, joinedload
from supabase import Client

# Security scheme for JWT tokens
security = HTTPBearer()


def get_db() -> Generator[Session, None, None]:
    """
    Database session dependency.
    Creates a new database session for each request and closes it when done.
    """
    yield from get_db_session()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    """
    Get the current authenticated user from JWT token.

    Args:
        credentials: JWT token from Authorization header
        db: Database session

    Returns:
        User: Current authenticated user

    Raises:
        HTTPException: If token is invalid or user not found
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # Verify and decode the JWT token
        payload = verify_token(credentials.credentials)
        user_id: Optional[str] = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except Exception:
        raise credentials_exception

    # Get user from database
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception

    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Get the current authenticated and active user.

    Args:
        current_user: Current user from get_current_user dependency

    Returns:
        User: Current active user

    Raises:
        HTTPException: If user is inactive
    """
    if not getattr(current_user, "is_active"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user"
        )
    return current_user


async def get_current_admin_user(
    current_user: User = Depends(get_current_active_user),
) -> User:
    """
    Get the current authenticated admin user.

    Restricts access to users with SUPERADMIN or MLGOO_DILG role.

    Args:
        current_user: Current active user from get_current_active_user dependency

    Returns:
        User: Current admin user

    Raises:
        HTTPException: If user doesn't have admin privileges
    """
    if current_user.role not in [UserRole.SUPERADMIN, UserRole.MLGOO_DILG]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions. Admin access required.",
        )
    return current_user


def get_supabase_client() -> Client:
    """
    Get Supabase client dependency.

    Returns:
        Client: Supabase client for real-time operations and auth
    """
    return get_supabase()


def get_supabase_admin_client() -> Client:
    """
    Get Supabase admin client dependency.

    Returns:
        Client: Supabase admin client for server-side operations
    """
    return get_supabase_admin()


async def get_current_area_assessor_user(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> User:
    """
    Get the current authenticated Area Assessor user with governance area loaded.

    - Requires role to be AREA_ASSESSOR
    - Ensures an assigned governance_area exists
    - Returns the user with governance_area eagerly loaded

    Raises:
        HTTPException: 403 if role is not AREA_ASSESSOR or governance area missing
    """
    user_with_area = (
        db.query(User)
        .options(joinedload(User.governance_area))
        .filter(User.id == current_user.id)
        .first()
    )

    if not user_with_area:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if (
        getattr(user_with_area, "role", None) is None
        or user_with_area.role != UserRole.AREA_ASSESSOR
    ):
         raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions. Area Assessor access required.",
        )

    if user_with_area.governance_area is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Assessor must be assigned to a governance area.",
        )

    return user_with_area


async def get_current_area_assessor_user_http(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    """
    HTTP-friendly dependency that authenticates and enforces Area Assessor role.

    Returns 401 for any invalid credentials or missing assessor context to align
    with tests that expect unauthorized when user context is incomplete.
    """
    # Verify and decode JWT
    try:
        payload = verify_token(credentials.credentials)
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Load user
    user = db.query(User).filter(User.id == user_id).first()
    if user is None or not getattr(user, "is_active", False):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Enforce assessor role and governance area
    if getattr(user, "role", None) != UserRole.AREA_ASSESSOR:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_with_area = (
        db.query(User).options(joinedload(User.governance_area)).filter(User.id == user.id).first()
    )
    if user_with_area is None or user_with_area.governance_area is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user_with_area

    return user_with_area
