# 🏛️ Governance Area Database Model
# SQLAlchemy model for the governance_areas table

from sqlalchemy import Column, String, SmallInteger

from app.db.base import Base


class GovernanceArea(Base):
    """
    Governance Area table model for database storage.
    
    Represents the SGLGB governance areas that Area Assessors can be assigned to.
    Each area has a type: 1=Core, 2=Essential
    """
    __tablename__ = "governance_areas"
    
    # Primary key
    id = Column(SmallInteger, primary_key=True, index=True)
    
    # Area information
    name = Column(String, nullable=False, unique=True)
    area_type = Column(SmallInteger, nullable=False)  # 1=Core, 2=Essential 