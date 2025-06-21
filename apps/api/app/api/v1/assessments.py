# 📋 SGLGB Assessment API Endpoints
# Endpoints for creating, managing, and retrieving leadership assessments

from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_active_user
from app.db.models.user import User
from app.db.models.assessment import Assessment
from app.schemas.assessment import AssessmentCreate, AssessmentUpdate, AssessmentInDB
from app.services.assessment_service import AssessmentService
from app.workers.sglgb_classifier import SGLGBClassifier

router = APIRouter()


@router.get("/", response_model=List[AssessmentInDB])
def read_assessments(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Retrieve assessments for the current user.
    """
    assessment_service = AssessmentService(db)
    assessments = assessment_service.get_multi_by_user(
        user_id=current_user.id, skip=skip, limit=limit
    )
    return assessments


@router.post("/", response_model=AssessmentInDB)
def create_assessment(
    *,
    db: Session = Depends(get_db),
    assessment_in: AssessmentCreate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Create new assessment for the current user.
    """
    assessment_service = AssessmentService(db)
    assessment = assessment_service.create_with_user(
        obj_in=assessment_in, user_id=current_user.id
    )
    return assessment


@router.get("/{assessment_id}", response_model=AssessmentInDB)
def read_assessment(
    *,
    db: Session = Depends(get_db),
    assessment_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get assessment by ID.
    """
    assessment_service = AssessmentService(db)
    assessment = assessment_service.get(id=assessment_id)
    
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Assessment not found"
        )
    
    # Users can only access their own assessments (unless admin)
    if not current_user.is_superuser and assessment.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    return assessment


@router.put("/{assessment_id}", response_model=AssessmentInDB)
def update_assessment(
    *,
    db: Session = Depends(get_db),
    assessment_id: int,
    assessment_in: AssessmentUpdate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Update an assessment.
    """
    assessment_service = AssessmentService(db)
    assessment = assessment_service.get(id=assessment_id)
    
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Assessment not found"
        )
    
    # Users can only update their own assessments (unless admin)
    if not current_user.is_superuser and assessment.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    assessment = assessment_service.update(db_obj=assessment, obj_in=assessment_in)
    return assessment


@router.delete("/{assessment_id}")
def delete_assessment(
    *,
    db: Session = Depends(get_db),
    assessment_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Delete an assessment.
    """
    assessment_service = AssessmentService(db)
    assessment = assessment_service.get(id=assessment_id)
    
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Assessment not found"
        )
    
    # Users can only delete their own assessments (unless admin)
    if not current_user.is_superuser and assessment.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    assessment = assessment_service.remove(id=assessment_id)
    return {"msg": "Assessment deleted successfully"}


@router.post("/{assessment_id}/upload-mov")
def upload_mov_file(
    *,
    db: Session = Depends(get_db),
    assessment_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Upload MOV (Means of Verification) file for an assessment.
    This will trigger the SGLGB classification process.
    """
    assessment_service = AssessmentService(db)
    assessment = assessment_service.get(id=assessment_id)
    
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Assessment not found"
        )
    
    # Users can only upload to their own assessments
    if assessment.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Validate file type
    allowed_extensions = [".mov", ".mp4", ".avi", ".mkv"]
    if not any(file.filename.lower().endswith(ext) for ext in allowed_extensions):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not allowed. Allowed types: {', '.join(allowed_extensions)}"
        )
    
    # Save file and trigger classification (this would be implemented in the service)
    mov_file = assessment_service.upload_mov_file(
        assessment_id=assessment_id, 
        file=file
    )
    
    # Trigger background classification task
    classifier = SGLGBClassifier()
    classification_result = classifier.classify_video(mov_file.file_path)
    
    # Update assessment with classification results
    assessment_service.update_classification_results(
        assessment_id=assessment_id,
        results=classification_result
    )
    
    return {
        "msg": "File uploaded successfully", 
        "file_id": mov_file.id,
        "classification_status": "completed"
    }


@router.post("/{assessment_id}/submit")
def submit_assessment(
    *,
    db: Session = Depends(get_db),
    assessment_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Submit assessment for final review and scoring.
    """
    assessment_service = AssessmentService(db)
    assessment = assessment_service.get(id=assessment_id)
    
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Assessment not found"
        )
    
    if assessment.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Submit assessment (mark as completed, calculate final scores, etc.)
    assessment = assessment_service.submit_assessment(assessment_id=assessment_id)
    
    return {
        "msg": "Assessment submitted successfully",
        "final_score": assessment.final_score,
        "status": assessment.status
    } 