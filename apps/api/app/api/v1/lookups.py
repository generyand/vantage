# 📚 Lookups API Routes
# Endpoints for fetching data from lookup tables like
# governance areas and barangays.

from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api import deps
from app.schemas import lookups as lookup_schema
from app.services.governance_area_service import governance_area_service
from app.services.barangay_service import barangay_service

router = APIRouter()


@router.get(
    "/governance-areas",
    response_model=List[lookup_schema.GovernanceArea],
    tags=["Lookups"],
)
def get_all_governance_areas(
    db: Session = Depends(deps.get_db),
):
    """
    Retrieve all governance areas.
    Accessible by all authenticated users.
    """
    return governance_area_service.get_all_governance_areas(db)


@router.get(
    "/barangays",
    response_model=List[lookup_schema.Barangay],
    tags=["Lookups"],
)
def get_all_barangays(
    db: Session = Depends(deps.get_db),
):
    """
    Retrieve all barangays.
    Accessible by all authenticated users.
    """
    return barangay_service.get_all_barangays(db) 