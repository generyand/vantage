# 📁 Project Database Model
# SQLAlchemy model for the projects table

from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.base import Base


class Project(Base):
    """
    Project table model for database storage.
    
    Represents assessment projects created by users.
    """
    __tablename__ = "projects"
    
    # Primary key
    id = Column(String, primary_key=True, index=True)
    
    # Project information
    name = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    
    # Foreign key to users table
    owner_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    owner = relationship("User", back_populates="projects")
    assessments = relationship("Assessment", back_populates="project") 