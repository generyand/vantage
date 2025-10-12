# 📋 Assessments API Routes
# Endpoints for assessment management and assessment data

from typing import Any, Dict

from app.api import deps
from app.db.enums import UserRole
from app.db.models.assessment import MOV
from app.db.models.user import User
from app.schemas.assessment import (
    AssessmentDashboardResponse,
    AssessmentResponse,
    AssessmentResponseCreate,
    AssessmentResponseUpdate,
    AssessmentSubmissionValidation,
    MOVCreate,
)
from app.services.assessment_service import assessment_service
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter()


async def get_current_blgu_user(
    current_user: User = Depends(deps.get_current_active_user),
) -> User:
    """
    Get the current authenticated BLGU user.

    Restricts access to users with BLGU_USER role.

    Args:
        current_user: Current active user from get_current_active_user dependency

    Returns:
        User: Current BLGU user

    Raises:
        HTTPException: If user doesn't have BLGU privileges
    """
    if current_user.role.value != UserRole.BLGU_USER.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions. BLGU user access required.",
        )
    return current_user


@router.get(
    "/dashboard", response_model=AssessmentDashboardResponse, tags=["assessments"]
)
async def get_assessment_dashboard(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(get_current_blgu_user),
):
    """
    Get dashboard data for the logged-in BLGU user's assessment.

    Returns dashboard-specific data optimized for overview and progress tracking:
    - Progress statistics (completed/total indicators)
    - Governance area progress summaries
    - Performance metrics (responses requiring rework, with feedback, with MOVs)
    - Recent feedback summaries
    - Assessment status and metadata

    This endpoint automatically creates an assessment if one doesn't exist
    for the BLGU user.
    """
    try:
        dashboard_data = assessment_service.get_assessment_dashboard_data(
            db, getattr(current_user, "id")
        )

        if not dashboard_data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to retrieve dashboard data",
            )

        return dashboard_data

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving dashboard data: {str(e)}",
        ) from e


@router.get("/my-assessment", response_model=Dict[str, Any], tags=["assessments"])
async def get_my_assessment(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(get_current_blgu_user),
):
    """
    Get the complete assessment data for the logged-in BLGU user.

    Returns the full assessment data including:
    - Assessment status and metadata
    - All governance areas with their indicators
    - Form schemas for each indicator
    - Existing response data for each indicator
    - MOVs (Means of Verification) for each response
    - Feedback comments from assessors

    This endpoint automatically creates an assessment if one doesn't exist
    for the BLGU user.
    """
    try:
        assessment_data = assessment_service.get_assessment_for_blgu_with_full_data(
            db, getattr(current_user, "id")
        )

        if not assessment_data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to retrieve assessment data",
            )

        return assessment_data

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving assessment data: {str(e)}",
        ) from e


@router.get(
    "/responses/{response_id}", response_model=AssessmentResponse, tags=["assessments"]
)
async def get_assessment_response(
    response_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(get_current_blgu_user),
):
    """
    Get a specific assessment response by ID.

    Returns the assessment response with all related data including:
    - Response data (JSON)
    - Completion status
    - MOVs (Means of Verification)
    - Feedback comments
    """
    response = assessment_service.get_assessment_response(db, response_id)

    if not response:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment response not found",
        )

    # Verify that the response belongs to the current user's assessment
    assessment = assessment_service.get_assessment_for_blgu(
        db, getattr(current_user, "id")
    )
    if assessment is None or response.assessment_id != assessment.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Response does not belong to your assessment",
        )

    return response


@router.put(
    "/responses/{response_id}", response_model=AssessmentResponse, tags=["assessments"]
)
async def update_assessment_response(
    response_id: int,
    response_update: AssessmentResponseUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(get_current_blgu_user),
):
    """
    Update an assessment response with validation.

    Updates the response data and validates it against the indicator's form schema.
    The response data must conform to the JSON schema defined in the indicator's
    form_schema field.

    Business Rules:
    - Only responses belonging to the current user's assessment can be updated
    - Response data is validated against the indicator's form schema
    - Completion status is automatically updated based on response data
    """
    # First verify the response belongs to the current user
    response = assessment_service.get_assessment_response(db, response_id)
    if not response:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment response not found",
        )

    # Verify ownership
    assessment = assessment_service.get_assessment_for_blgu(
        db, getattr(current_user, "id")
    )
    if assessment is None or response.assessment_id != assessment.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Response does not belong to your assessment",
        )

    # Check if assessment is in a state that allows updates
    if assessment.status not in [
        assessment.status.DRAFT,
        assessment.status.NEEDS_REWORK,
    ]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot update response. Assessment status is {assessment.status.value}",
        )

    try:
        updated_response = assessment_service.update_assessment_response(
            db, response_id, response_update
        )

        if not updated_response:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Assessment response not found",
            )

        return updated_response

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating response: {str(e)}",
        ) from e


@router.post("/responses", response_model=AssessmentResponse, tags=["assessments"])
async def create_assessment_response(
    response_create: AssessmentResponseCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(get_current_blgu_user),
):
    """
    Create a new assessment response.

    Creates a new response for a specific indicator in the user's assessment.
    The response data is validated against the indicator's form schema.
    """
    # Verify the assessment belongs to the current user
    assessment = assessment_service.get_assessment_for_blgu(
        db, getattr(current_user, "id")
    )
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found for current user",
        )

    # Verify the response is for the user's assessment
    if response_create.assessment_id != assessment.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot create response for different assessment",
        )

    try:
        return assessment_service.create_assessment_response(db, response_create)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating response: {str(e)}",
        ) from e


@router.post(
    "/submit", response_model=AssessmentSubmissionValidation, tags=["assessments"]
)
async def submit_assessment(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(get_current_blgu_user),
):
    """
    Submit the assessment for review.

    Runs a preliminary compliance check before submission:
    - Ensures no "YES" answers exist without corresponding MOVs (Means of Verification)
    - Updates assessment status to "Submitted for Review"
    - Sets submission timestamp

    Returns validation results with any errors or warnings.
    """
    assessment = assessment_service.get_assessment_for_blgu(
        db, getattr(current_user, "id")
    )
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found for current user",
        )

    try:
        validation_result = assessment_service.submit_assessment(db, assessment.id)
        return validation_result

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error submitting assessment: {str(e)}",
        ) from e


@router.post("/responses/{response_id}/movs", response_model=MOV, tags=["assessments"])
async def upload_mov(
    response_id: int,
    mov_create: MOVCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(get_current_blgu_user),
):
    """
    Upload a MOV (Means of Verification) file for an assessment response.

    Creates a record of the uploaded file in the database. The actual file
    upload to Supabase Storage should be handled by the frontend before
    calling this endpoint.
    """
    # Verify the response belongs to the current user
    response = assessment_service.get_assessment_response(db, response_id)
    if not response:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment response not found",
        )

    assessment = assessment_service.get_assessment_for_blgu(
        db, getattr(current_user, "id")
    )
    if assessment is None or response.assessment_id != assessment.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Response does not belong to your assessment",
        )

    # Verify the MOV is for the correct response
    if mov_create.response_id != response_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="MOV response_id does not match URL parameter",
        )

    try:
        return assessment_service.create_mov(db, mov_create)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating MOV: {str(e)}",
        ) from e


@router.delete("/movs/{mov_id}", response_model=Dict[str, str], tags=["assessments"])
async def delete_mov(
    mov_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(get_current_blgu_user),
):
    """
    Delete a MOV (Means of Verification) file.

    Removes the MOV record from the database. The actual file deletion
    from Supabase Storage should be handled separately.
    """
    # First get the MOV to verify ownership
    mov = db.query(MOV).filter(MOV.id == mov_id).first()
    if mov is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="MOV not found"
        )

    # Verify the MOV belongs to the current user's assessment
    response = assessment_service.get_assessment_response(db, mov.response_id)
    if not response:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment response not found",
        )

    assessment = assessment_service.get_assessment_for_blgu(
        db, getattr(current_user, "id")
    )
    if assessment is None or response.assessment_id != assessment.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. MOV does not belong to your assessment",
        )

    try:
        success = assessment_service.delete_mov(db, mov_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="MOV not found"
            )

        return {"message": "MOV deleted successfully"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting MOV: {str(e)}",
        ) from e
