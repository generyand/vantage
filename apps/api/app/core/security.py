# 🔐 Security Functions
# Password hashing, JWT token creation/verification, and security utilities

from datetime import datetime, timedelta
from typing import Optional, Union

from app.core.config import settings
from jose import JWTError, jwt
from passlib.context import CryptContext

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_access_token(
    subject: Union[str, int],
    expires_delta: Optional[timedelta] = None,
    role: Optional[str] = None,
    must_change_password: Optional[bool] = None,
) -> str:
    """
    Create a new JWT access token.

    Args:
        subject: The subject (usually user ID) to encode in the token
        expires_delta: Custom expiration time, defaults to settings value
        role: User role to include in token payload
        must_change_password: Whether user must change password

    Returns:
        str: Encoded JWT token
    """
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode = {"exp": expire, "sub": str(subject)}

    # Add optional fields to payload
    if role is not None:
        to_encode["role"] = role
    if must_change_password is not None:
        to_encode["must_change_password"] = must_change_password

    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )
    return encoded_jwt


def verify_token(token: str) -> dict:
    """
    Verify and decode a JWT token.

    Args:
        token: JWT token string

    Returns:
        dict: Decoded token payload

    Raises:
        JWTError: If token is invalid or expired
    """
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        return payload
    except JWTError:
        raise JWTError("Invalid token")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against its hash.

    Args:
        plain_password: Plain text password
        hashed_password: Hashed password from database

    Returns:
        bool: True if password matches, False otherwise
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    Generate password hash.

    Args:
        password: Plain text password

    Returns:
        str: Hashed password
    """
    return pwd_context.hash(password)


def verify_password_reset_token(token: str) -> Optional[str]:
    """
    Verify password reset token and return user email.

    Args:
        token: Password reset token

    Returns:
        Optional[str]: User email if token is valid, None otherwise
    """
    try:
        decoded_token = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        return decoded_token.get("sub")
    except JWTError:
        return None


def generate_password_reset_token(email: str) -> str:
    """
    Generate a password reset token.

    Args:
        email: User email address

    Returns:
        str: Password reset token
    """
    delta = timedelta(hours=24)  # Token expires in 24 hours
    now = datetime.utcnow()
    expires = now + delta
    exp = expires.timestamp()
    encoded_jwt = jwt.encode(
        {"exp": exp, "nbf": now, "sub": email},
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )
    return encoded_jwt
