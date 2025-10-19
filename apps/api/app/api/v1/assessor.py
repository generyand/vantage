# 🧭 Assessor API Routes
# Endpoints for assessor-specific functionality (secure queue, validation actions)

from typing import List

from app.api import deps
from app.db.models.user import User
from app.schemas import (
    AssessmentDetailsResponse,
    AssessorQueueItem,
    MOVCreate,
    MOVUploadResponse,
    ValidationRequest,
    ValidationResponse,
)
from app.services import assessor_service
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/queue", response_model=List[AssessorQueueItem], tags=["assessor"])
async def get_assessor_queue(
    db: Session = Depends(deps.get_db),
    current_assessor: User = Depends(deps.get_current_area_assessor_user),
):
    """
    Get the assessor's secure submissions queue.

    Returns a list of submissions filtered by the assessor's governance area.
    """
    return assessor_service.get_assessor_queue(db=db, assessor=current_assessor)


@router.post(
    "/assessment-responses/{response_id}/validate",
    response_model=ValidationResponse,
    tags=["assessor"],
)
async def validate_assessment_response(
    response_id: int,
    validation_data: ValidationRequest,
    db: Session = Depends(deps.get_db),
    current_assessor: User = Depends(deps.get_current_area_assessor_user),
):
    """
    Validate an assessment response.

    Accepts validation status (Pass/Fail/Conditional), public comment, and internal note.
    Saves both comments to the feedback_comments table with appropriate flags.
    """
    result = assessor_service.validate_assessment_response(
        db=db,
        response_id=response_id,
        assessor=current_assessor,
        validation_status=validation_data.validation_status,
        public_comment=validation_data.public_comment,
        internal_note=validation_data.internal_note,
    )

    return ValidationResponse(**result)


@router.post(
    "/assessment-responses/{response_id}/movs",
    response_model=MOVUploadResponse,
    tags=["assessor"],
)
async def upload_mov_for_assessor(
    response_id: int,
    mov_data: MOVCreate,
    db: Session = Depends(deps.get_db),
    current_assessor: User = Depends(deps.get_current_area_assessor_user),
):
    """
    Upload a MOV (Means of Verification) for an assessment response.

    Allows assessors to upload MOVs for assessment responses they are reviewing.
    The assessor must have permission to review responses in the same governance
    area as the assessment response's indicator.

    Note: The actual file upload to Supabase Storage should be handled by the
    frontend before calling this endpoint.
    """
    # Verify the MOV is for the correct response
    if mov_data.response_id != response_id:
        return MOVUploadResponse(
            success=False,
            message="MOV response_id does not match URL parameter",
            mov_id=None,
        )

    result = assessor_service.create_mov_for_assessor(
        db=db, mov_create=mov_data, assessor=current_assessor
    )

    return MOVUploadResponse(**result)


@router.get(
    "/assessments/{assessment_id}",
    response_model=AssessmentDetailsResponse,
    tags=["assessor"],
)
async def get_assessment_details(
    assessment_id: int,
    db: Session = Depends(deps.get_db),
    current_assessor: User = Depends(deps.get_current_area_assessor_user),
):
    """
    Get detailed assessment data for assessor review.

    Returns full assessment details including:
    - Assessment metadata and status
    - BLGU user information and barangay details
    - All responses with indicators and technical notes
    - MOVs (Means of Verification) for each response
    - Feedback comments from assessors

    The assessor must have permission to view assessments in their
    governance area. Technical notes are included for each indicator
    to provide guidance during the review process.
    """
    result = assessor_service.get_assessment_details_for_assessor(
        db=db, assessment_id=assessment_id, assessor=current_assessor
    )

    return AssessmentDetailsResponse(**result)
