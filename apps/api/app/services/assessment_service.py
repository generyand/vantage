# 📋 Assessment Service
# Business logic for assessment management operations

from datetime import datetime
from typing import Any, Dict, List, Optional

from sqlalchemy import and_, func
from sqlalchemy.orm import Session, joinedload

from app.db.enums import AssessmentStatus, MOVStatus
from app.db.models import (
    MOV,
    Assessment,
    AssessmentResponse,
    FeedbackComment,
    GovernanceArea,
)
from app.schemas.assessment import (
    AssessmentCreate,
    AssessmentResponseCreate,
    AssessmentResponseUpdate,
    AssessmentSubmissionValidation,
    FeedbackCommentCreate,
    FormSchemaValidation,
    MOVCreate,
)
from fastapi import HTTPException, status


class AssessmentService:
    """Service class for assessment management operations."""

    def get_assessment_for_blgu(
        self, db: Session, blgu_user_id: int
    ) -> Optional[Assessment]:
        """
        Get the assessment for a specific BLGU user.

        Args:
            db: Database session
            blgu_user_id: ID of the BLGU user

        Returns:
            Assessment object or None if not found
        """
        return (
            db.query(Assessment).filter(Assessment.blgu_user_id == blgu_user_id).first()
        )

    def get_assessment_with_responses(
        self, db: Session, assessment_id: int
    ) -> Optional[Assessment]:
        """
        Get assessment with all its responses and related data.

        Args:
            db: Database session
            assessment_id: ID of the assessment

        Returns:
            Assessment with responses or None if not found
        """
        return (
            db.query(Assessment)
            .options(
                joinedload(Assessment.responses)
                .joinedload(AssessmentResponse.indicator)
                .joinedload(AssessmentResponse.movs)
                .joinedload(AssessmentResponse.feedback_comments)
            )
            .filter(Assessment.id == assessment_id)
            .first()
        )

    def get_assessment_for_blgu_with_full_data(
        self, db: Session, blgu_user_id: int
    ) -> Optional[Dict[str, Any]]:
        """
        Get complete assessment data for BLGU user including all governance areas,
        indicators, and responses.

        Args:
            db: Database session
            blgu_user_id: ID of the BLGU user

        Returns:
            Dictionary with assessment and governance areas data
        """
        # Get or create assessment
        assessment = self.get_assessment_for_blgu(db, blgu_user_id)
        if not assessment:
            assessment = self.create_assessment(
                db, AssessmentCreate(blgu_user_id=blgu_user_id)
            )

        # Get all governance areas with their indicators
        governance_areas = (
            db.query(GovernanceArea)
            .options(joinedload(GovernanceArea.indicators))
            .all()
        )

        # Get all responses for this assessment
        responses = (
            db.query(AssessmentResponse)
            .options(
                joinedload(AssessmentResponse.indicator),
                joinedload(AssessmentResponse.movs),
                joinedload(AssessmentResponse.feedback_comments),
            )
            .filter(AssessmentResponse.assessment_id == assessment.id)
            .all()
        )

        # Create response lookup
        response_lookup = {r.indicator_id: r for r in responses}

        # Build governance areas with indicators and responses
        governance_areas_data = []
        for area in governance_areas:
            area_data = {
                "id": area.id,
                "name": area.name,
                "area_type": area.area_type.value,
                "indicators": [],
            }

            for indicator in area.indicators:
                response = response_lookup.get(indicator.id)
                indicator_data = {
                    "id": indicator.id,
                    "name": indicator.name,
                    "description": indicator.description,
                    "form_schema": indicator.form_schema,
                    "response": response,
                    "movs": response.movs if response else [],
                    "feedback_comments": response.feedback_comments if response else [],
                }
                area_data["indicators"].append(indicator_data)

            governance_areas_data.append(area_data)

        return {
            "assessment": assessment,
            "governance_areas": governance_areas_data,
        }

    def create_assessment(
        self, db: Session, assessment_create: AssessmentCreate
    ) -> Assessment:
        """
        Create a new assessment for a BLGU user.

        Args:
            db: Database session
            assessment_create: Assessment creation data

        Returns:
            Created Assessment object
        """
        # Check if assessment already exists
        existing = self.get_assessment_for_blgu(db, assessment_create.blgu_user_id)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Assessment already exists for this BLGU user",
            )

        db_assessment = Assessment(
            blgu_user_id=assessment_create.blgu_user_id,
            status=AssessmentStatus.DRAFT,
        )

        db.add(db_assessment)
        db.commit()
        db.refresh(db_assessment)
        return db_assessment

    def get_assessment_response(
        self, db: Session, response_id: int
    ) -> Optional[AssessmentResponse]:
        """
        Get an assessment response by ID.

        Args:
            db: Database session
            response_id: ID of the response

        Returns:
            AssessmentResponse object or None if not found
        """
        return (
            db.query(AssessmentResponse)
            .options(
                joinedload(AssessmentResponse.indicator),
                joinedload(AssessmentResponse.movs),
                joinedload(AssessmentResponse.feedback_comments),
            )
            .filter(AssessmentResponse.id == response_id)
            .first()
        )

    def create_assessment_response(
        self, db: Session, response_create: AssessmentResponseCreate
    ) -> AssessmentResponse:
        """
        Create a new assessment response.

        Args:
            db: Database session
            response_create: Response creation data

        Returns:
            Created AssessmentResponse object
        """
        # Check if response already exists for this assessment and indicator
        existing = (
            db.query(AssessmentResponse)
            .filter(
                and_(
                    AssessmentResponse.assessment_id == response_create.assessment_id,
                    AssessmentResponse.indicator_id == response_create.indicator_id,
                )
            )
            .first()
        )

        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Response already exists for this assessment and indicator",
            )

        db_response = AssessmentResponse(
            response_data=response_create.response_data,
            assessment_id=response_create.assessment_id,
            indicator_id=response_create.indicator_id,
        )

        db.add(db_response)
        db.commit()
        db.refresh(db_response)
        return db_response

    def update_assessment_response(
        self, db: Session, response_id: int, response_update: AssessmentResponseUpdate
    ) -> Optional[AssessmentResponse]:
        """
        Update an assessment response with validation against form schema.

        Args:
            db: Database session
            response_id: ID of the response to update
            response_update: Response update data

        Returns:
            Updated AssessmentResponse object or None if not found
        """
        db_response = self.get_assessment_response(db, response_id)
        if not db_response:
            return None

        # Validate response_data against indicator's form_schema if provided
        if response_update.response_data is not None:
            validation_result = self.validate_response_data(
                db_response.indicator.form_schema, response_update.response_data
            )
            if not validation_result.is_valid:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Response data validation failed: {', '.join(validation_result.errors)}",
                )

        # Update fields that are provided
        update_data = response_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_response, field, value)

        # Auto-set completion status based on response_data
        if response_update.response_data is not None:
            db_response.is_completed = bool(response_update.response_data)

        db.commit()
        db.refresh(db_response)
        return db_response

    def validate_response_data(
        self, form_schema: Dict[str, Any], response_data: Dict[str, Any]
    ) -> FormSchemaValidation:
        """
        Validate response data against the indicator's form schema.

        Args:
            form_schema: JSON schema defining the expected form structure
            response_data: User's response data to validate

        Returns:
            FormSchemaValidation with validation results
        """
        errors = []
        warnings: list[Dict[str, Any]] = []

        try:
            # Basic validation - check if response_data matches schema structure
            if not isinstance(response_data, dict):
                errors.append("Response data must be a JSON object")
                return FormSchemaValidation(is_valid=False, errors=errors)

            # Check required fields from schema
            required_fields = form_schema.get("required", [])
            for field in required_fields:
                if field not in response_data:
                    errors.append(f"Required field '{field}' is missing")

            # Check field types and values
            properties = form_schema.get("properties", {})
            for field, value in response_data.items():
                if field in properties:
                    field_schema = properties[field]
                    field_errors = self._validate_field(field, value, field_schema)
                    errors.extend(field_errors)

            # Additional business logic validations
            self._validate_business_rules(response_data, form_schema, warnings)

        except Exception as e:
            errors.append(f"Validation error: {str(e)}")

        return FormSchemaValidation(
            is_valid=len(errors) == 0, errors=errors, warnings=warnings
        )

    def _validate_field(
        self, field_name: str, value: Any, field_schema: Dict[str, Any]
    ) -> List[str]:
        """Validate a single field against its schema."""
        errors = []

        # Check field type
        expected_type = field_schema.get("type")
        if expected_type:
            if expected_type == "string" and not isinstance(value, str):
                errors.append(f"Field '{field_name}' must be a string")
            elif expected_type == "number" and not isinstance(value, (int, float)):
                errors.append(f"Field '{field_name}' must be a number")
            elif expected_type == "boolean" and not isinstance(value, bool):
                errors.append(f"Field '{field_name}' must be a boolean")
            elif expected_type == "array" and not isinstance(value, list):
                errors.append(f"Field '{field_name}' must be an array")

        # Check enum values
        enum_values = field_schema.get("enum")
        if enum_values and value not in enum_values:
            errors.append(
                f"Field '{field_name}' must be one of: {', '.join(map(str, enum_values))}"
            )

        return errors

    def _validate_business_rules(
        self,
        response_data: Dict[str, Any],
        form_schema: Dict[str, Any],
        warnings: List[Dict[str, Any]],
    ) -> None:
        """Apply business-specific validation rules."""
        # Example: Check if "YES" answers have corresponding MOVs
        # This would be implemented based on specific business requirements
        pass

    def submit_assessment(
        self, db: Session, assessment_id: int
    ) -> AssessmentSubmissionValidation:
        """
        Submit an assessment for review with preliminary compliance check.

        Args:
            db: Database session
            assessment_id: ID of the assessment to submit

        Returns:
            AssessmentSubmissionValidation with submission results
        """
        assessment = self.get_assessment_with_responses(db, assessment_id)
        if not assessment:
            return AssessmentSubmissionValidation(
                is_valid=False, errors=[{"error": "Assessment not found"}]
            )

        # Check if assessment is in correct status for submission
        if assessment.status != AssessmentStatus.DRAFT:
            return AssessmentSubmissionValidation(
                is_valid=False,
                errors=[
                    {
                        "error": f"Assessment must be in DRAFT status to submit. Current status: {assessment.status.value}"
                    }
                ],
            )

        # Run preliminary compliance check
        validation_result = self._run_preliminary_compliance_check(db, assessment)

        if validation_result.is_valid:
            # Update assessment status
            assessment.status = AssessmentStatus.SUBMITTED_FOR_REVIEW
            assessment.submitted_at = datetime.utcnow()
            db.commit()
            db.refresh(assessment)

        return validation_result

    def _run_preliminary_compliance_check(
        self, db: Session, assessment: Assessment
    ) -> AssessmentSubmissionValidation:
        """
        Run preliminary compliance check on assessment.

        Business Rule: No "YES" answers without MOVs (Means of Verification).

        Args:
            db: Database session
            assessment: Assessment to validate

        Returns:
            AssessmentSubmissionValidation with validation results
        """
        errors = []
        warnings: list[Dict[str, Any]] = []

        for response in assessment.responses:
            if not response.response_data:
                continue

            # Check for "YES" answers without MOVs
            has_yes_answer = self._has_yes_answer(response.response_data)
            has_movs = len(response.movs) > 0

            if has_yes_answer and not has_movs:
                errors.append(
                    {
                        "indicator_id": response.indicator_id,
                        "indicator_name": response.indicator.name,
                        "error": "YES answer requires Means of Verification (MOV)",
                    }
                )

        return AssessmentSubmissionValidation(
            is_valid=len(errors) == 0, errors=errors, warnings=warnings
        )

    def _has_yes_answer(self, response_data: Dict[str, Any]) -> bool:
        """Check if response data contains any "YES" answers."""
        for value in response_data.values():
            if isinstance(value, str) and value.upper() == "YES":
                return True
            elif isinstance(value, bool) and value:
                return True
        return False

    def create_mov(self, db: Session, mov_create: MOVCreate) -> MOV:
        """
        Create a new MOV (Means of Verification) record.

        Args:
            db: Database session
            mov_create: MOV creation data

        Returns:
            Created MOV object
        """
        db_mov = MOV(
            filename=mov_create.filename,
            original_filename=mov_create.original_filename,
            file_size=mov_create.file_size,
            content_type=mov_create.content_type,
            storage_path=mov_create.storage_path,
            response_id=mov_create.response_id,
            status=MOVStatus.UPLOADED,
        )

        db.add(db_mov)
        db.commit()
        db.refresh(db_mov)
        return db_mov

    def delete_mov(self, db: Session, mov_id: int) -> bool:
        """
        Delete a MOV record.

        Args:
            db: Database session
            mov_id: ID of the MOV to delete

        Returns:
            True if deleted, False if not found
        """
        db_mov = db.query(MOV).filter(MOV.id == mov_id).first()
        if not db_mov:
            return False

        db.delete(db_mov)
        db.commit()
        return True

    def create_feedback_comment(
        self, db: Session, comment_create: FeedbackCommentCreate
    ) -> FeedbackComment:
        """
        Create a new feedback comment.

        Args:
            db: Database session
            comment_create: Comment creation data

        Returns:
            Created FeedbackComment object
        """
        db_comment = FeedbackComment(
            comment=comment_create.comment,
            comment_type=comment_create.comment_type,
            response_id=comment_create.response_id,
            assessor_id=comment_create.assessor_id,
        )

        db.add(db_comment)
        db.commit()
        db.refresh(db_comment)
        return db_comment

    def get_assessment_stats(self, db: Session) -> Dict[str, Any]:
        """
        Get assessment statistics for admin dashboard.

        Args:
            db: Database session

        Returns:
            Dictionary with assessment statistics
        """
        total_assessments = db.query(Assessment).count()

        # Assessments by status
        status_stats = (
            db.query(Assessment.status, func.count(Assessment.id))
            .group_by(Assessment.status)
            .all()
        )

        # Responses by completion status
        total_responses = db.query(AssessmentResponse).count()
        completed_responses = (
            db.query(AssessmentResponse).filter(AssessmentResponse.is_completed).count()
        )
        responses_requiring_rework = (
            db.query(AssessmentResponse)
            .filter(AssessmentResponse.requires_rework)
            .count()
        )

        return {
            "total_assessments": total_assessments,
            "assessments_by_status": {status: count for status, count in status_stats},
            "total_responses": total_responses,
            "completed_responses": completed_responses,
            "responses_requiring_rework": responses_requiring_rework,
        }


# Create service instance
assessment_service = AssessmentService()
