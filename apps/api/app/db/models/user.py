# 👥 User Database Model
# SQLAlchemy model for the users table

from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Integer
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.base import Base


class User(Base):
    """
    User table model for database storage.
    
    This represents the actual database table structure,
    not the API request/response format.
    """
    __tablename__ = "users"
    
    # Primary key
    id = Column(String, primary_key=True, index=True)
    
    # User information
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    phone_number = Column(String, nullable=True)
    role = Column(String, nullable=False, default="BLGU User")
    barangay_id = Column(Integer, ForeignKey("barangays.id"), nullable=True)
    
    # Authentication
    hashed_password = Column(String, nullable=False)
    must_change_password = Column(Boolean, default=True, nullable=False)
    
    # User status
    is_active = Column(Boolean, default=True, nullable=False)
    is_superuser = Column(Boolean, default=False, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    barangay = relationship("Barangay", back_populates="users") 