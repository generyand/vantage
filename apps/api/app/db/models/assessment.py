# 📊 Assessment Database Model
# SQLAlchemy model for the assessments table

from sqlalchemy import Column, String, DateTime, Text, ForeignKey, JSON, Enum as SQLEnum, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

from app.db.base import Base


class AssessmentStatus(enum.Enum):
    """Assessment status enumeration."""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    REVIEWED = "reviewed"


class Assessment(Base):
    """
    Assessment table model for database storage.
    
    Represents SGLGB (Strong, Gallant, Loyal, Guiding, Bold) 
    leadership assessments conducted on video submissions.
    """
    __tablename__ = "assessments"
    
    # Primary key
    id = Column(String, primary_key=True, index=True)
    
    # Foreign keys
    project_id = Column(String, ForeignKey("projects.id"), nullable=False, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    
    # Assessment metadata
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(SQLEnum(AssessmentStatus), default=AssessmentStatus.PENDING, nullable=False)
    
    # Video information
    video_filename = Column(String, nullable=True)
    video_url = Column(String, nullable=True)
    video_duration = Column(Float, nullable=True)  # Duration in seconds
    
    # SGLGB Scores (0.0 to 1.0)
    score_strong = Column(Float, nullable=True)
    score_gallant = Column(Float, nullable=True) 
    score_loyal = Column(Float, nullable=True)
    score_guiding = Column(Float, nullable=True)
    score_bold = Column(Float, nullable=True)
    
    # Overall assessment
    overall_score = Column(Float, nullable=True)
    dominant_trait = Column(String, nullable=True)  # The highest scoring trait
    
    # Analysis results (JSON format for flexibility)
    analysis_data = Column(JSON, nullable=True)  # Detailed analysis results
    recommendations = Column(JSON, nullable=True)  # Development recommendations
    
    # Processing metadata
    processing_started_at = Column(DateTime(timezone=True), nullable=True)
    processing_completed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    project = relationship("Project", back_populates="assessments")
    user = relationship("User", back_populates="assessments") 