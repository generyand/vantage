# 🧾 Assessor Schemas
# Pydantic models for assessor-related API responses/requests

from datetime import datetime

from app.db.enums import ValidationStatus
from pydantic import BaseModel


class AssessorQueueItem(BaseModel):
    assessment_id: int
    barangay_name: str
    submission_date: datetime | None
    status: str
    updated_at: datetime

    class Config:
        from_attributes = True


class ValidationRequest(BaseModel):
    """Request schema for validating an assessment response."""

    validation_status: ValidationStatus
    public_comment: str | None = None
    internal_note: str | None = None


class ValidationResponse(BaseModel):
    """Response schema for validation endpoint."""

    success: bool
    message: str
    assessment_response_id: int
    validation_status: ValidationStatus


class MOVUploadResponse(BaseModel):
    """Response schema for MOV upload endpoint."""

    success: bool
    message: str
    mov_id: int | None


class AssessmentDetailsResponse(BaseModel):
    """Response schema for assessment details endpoint."""

    success: bool
    message: str | None = None
    assessment_id: int | None = None
    assessment: dict | None = None
