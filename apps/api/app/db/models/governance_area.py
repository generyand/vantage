# 🏛️ Governance Area Database Model
# SQLAlchemy model for the governance_areas table

from sqlalchemy import Column, String, SmallInteger, Enum
from sqlalchemy.orm import relationship

from app.db.base import Base
from app.db.enums import AreaType


class GovernanceArea(Base):
    """
    Governance Area table model for database storage.
    
    Represents the SGLGB governance areas that Area Assessors can be assigned to.
    Each area has a type: Core or Essential
    """
    __tablename__ = "governance_areas"
    
    # Primary key
    id = Column(SmallInteger, primary_key=True, index=True)
    
    # Area information
    name = Column(String, nullable=False, unique=True)
    area_type = Column(Enum(AreaType, name="area_type_enum", create_constraint=True), nullable=False)
    
    # Relationships
    assessors = relationship("User", back_populates="governance_area") 