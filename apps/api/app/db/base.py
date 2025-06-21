# 🗄️ Database Base Configuration
# Supabase client, SQLAlchemy engine, session management, and base models

from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from supabase import create_client, Client

from app.core.config import settings

# Supabase client for real-time features, auth, and storage
supabase: Client = create_client(
    settings.SUPABASE_URL, 
    settings.SUPABASE_ANON_KEY
)

# Admin Supabase client for server-side operations
supabase_admin: Client = create_client(
    settings.SUPABASE_URL, 
    settings.SUPABASE_SERVICE_ROLE_KEY
) if settings.SUPABASE_SERVICE_ROLE_KEY else None

# SQLAlchemy engine for direct database operations
engine = None
SessionLocal = None

if settings.DATABASE_URL:
    # Create database engine with Supabase PostgreSQL
    engine = create_engine(
        settings.DATABASE_URL,
        # Connection pool settings optimized for Supabase
        pool_pre_ping=True,
        pool_recycle=300,
        pool_size=10,
        max_overflow=20,
        # Supabase specific connection parameters
        connect_args={
            "options": "-c timezone=utc",
            "sslmode": "require",
        }
    )
    
    # Create session factory
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for SQLAlchemy models
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """
    Database session generator for SQLAlchemy operations.
    Creates a new session for each request and ensures it's properly closed.
    
    Yields:
        Session: SQLAlchemy database session
    """
    if not SessionLocal:
        raise RuntimeError("Database not configured. Please set DATABASE_URL in environment variables.")
    
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_supabase() -> Client:
    """
    Get Supabase client for real-time operations, auth, and storage.
    
    Returns:
        Client: Supabase client instance
    """
    return supabase


def get_supabase_admin() -> Client:
    """
    Get Supabase admin client for server-side operations.
    
    Returns:
        Client: Supabase admin client instance
    
    Raises:
        RuntimeError: If service role key is not configured
    """
    if not supabase_admin:
        raise RuntimeError("Supabase admin client not configured. Please set SUPABASE_SERVICE_ROLE_KEY.")
    
    return supabase_admin 