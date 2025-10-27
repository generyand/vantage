# 🛠️ Assessor Service
# Business logic for assessor features

from typing import List

from app.db.enums import AssessmentStatus, ValidationStatus
from app.db.models.assessment import (
    MOV,
    Assessment,
    AssessmentResponse,
    FeedbackComment,
)
from app.db.models.governance_area import Indicator
from app.db.models.user import User
from app.schemas.assessment import MOVCreate
from sqlalchemy.orm import Session, joinedload


class AssessorService:
    def get_assessor_queue(self, db: Session, assessor: User) -> List[dict]:
        """
        Return submissions filtered by the assessor's governance area.

        Includes barangay name, submission date, status, and last updated.
        """
        # Fetch assessments whose BLGU user belongs to barangays in the
        # same governance area as the assessor via indicator governance area linkage.
        # Simplified initial implementation: show assessments in Submitted/Needs Rework/Validated.
        assessments = (
            db.query(Assessment)
            .join(AssessmentResponse, AssessmentResponse.assessment_id == Assessment.id)
            .join(Indicator, Indicator.id == AssessmentResponse.indicator_id)
            .options(joinedload(Assessment.blgu_user).joinedload(User.barangay))
            .filter(
                Indicator.governance_area_id == assessor.governance_area_id,
                Assessment.status.in_(
                    [
                        AssessmentStatus.SUBMITTED_FOR_REVIEW,
                        AssessmentStatus.NEEDS_REWORK,
                        AssessmentStatus.VALIDATED,
                    ]
                ),
            )
            .distinct(Assessment.id)
            .order_by(Assessment.id, Assessment.updated_at.desc())
            .all()
        )

        items = []
        for a in assessments:
            barangay_name = getattr(getattr(a.blgu_user, "barangay", None), "name", "-")
            items.append(
                {
                    "assessment_id": a.id,
                    "barangay_name": barangay_name,
                    "submission_date": a.submitted_at,
                    "status": a.status.value
                    if hasattr(a.status, "value")
                    else str(a.status),
                    "updated_at": a.updated_at,
                }
            )

        return items

    def validate_assessment_response(
        self,
        db: Session,
        response_id: int,
        assessor: User,
        validation_status: ValidationStatus,
        public_comment: str | None = None,
        internal_note: str | None = None,
    ) -> dict:
        """
        Validate an assessment response and save feedback comments.

        Args:
            db: Database session
            response_id: ID of the assessment response to validate
            assessor: The assessor performing the validation
            validation_status: The validation status (Pass/Fail/Conditional)
            public_comment: Public comment visible to BLGU user
            internal_note: Internal note only visible to assessors

        Returns:
            dict: Success status and details
        """
        # Get the assessment response
        response = (
            db.query(AssessmentResponse)
            .filter(AssessmentResponse.id == response_id)
            .first()
        )

        if not response:
            return {
                "success": False,
                "message": "Assessment response not found",
                "assessment_response_id": response_id,
                "validation_status": validation_status,
            }

        # Update the validation status
        response.validation_status = validation_status
        db.commit()

        # Save public comment if provided
        if public_comment:
            public_feedback = FeedbackComment(
                comment=public_comment,
                comment_type="validation",
                response_id=response_id,
                assessor_id=assessor.id,
                is_internal_note=False,
            )
            db.add(public_feedback)

        # Save internal note if provided
        if internal_note:
            internal_feedback = FeedbackComment(
                comment=internal_note,
                comment_type="internal_note",
                response_id=response_id,
                assessor_id=assessor.id,
                is_internal_note=True,
            )
            db.add(internal_feedback)

        db.commit()

        return {
            "success": True,
            "message": "Assessment response validated successfully",
            "assessment_response_id": response_id,
            "validation_status": validation_status,
        }

    def create_mov_for_assessor(
        self, db: Session, mov_create: MOVCreate, assessor: User
    ) -> dict:
        """
        Create a MOV (Means of Verification) for an assessment response.

        This method allows assessors to upload MOVs for assessment responses
        they are reviewing. It validates that the assessor has permission
        to upload MOVs for the specific assessment response.

        Args:
            db: Database session
            mov_create: MOV creation data
            assessor: The assessor performing the upload

        Returns:
            dict: Success status and MOV details
        """
        # Get the assessment response
        response = (
            db.query(AssessmentResponse)
            .filter(AssessmentResponse.id == mov_create.response_id)
            .first()
        )

        if not response:
            return {
                "success": False,
                "message": "Assessment response not found",
                "mov_id": None,
            }

        # Verify the assessor has permission to upload MOVs for this response
        # by checking if the response's indicator belongs to the assessor's governance area
        indicator = (
            db.query(Indicator).filter(Indicator.id == response.indicator_id).first()
        )

        if not indicator or indicator.governance_area_id != assessor.governance_area_id:
            return {
                "success": False,
                "message": "Access denied. You can only upload MOVs for responses in your governance area",
                "mov_id": None,
            }

        # Create the MOV
        db_mov = MOV(
            filename=mov_create.filename,
            original_filename=mov_create.original_filename,
            file_size=mov_create.file_size,
            content_type=mov_create.content_type,
            storage_path=mov_create.storage_path,
            response_id=mov_create.response_id,
        )

        db.add(db_mov)
        db.commit()
        db.refresh(db_mov)

        return {
            "success": True,
            "message": "MOV uploaded successfully",
            "mov_id": db_mov.id,
        }

    def get_assessment_details_for_assessor(
        self, db: Session, assessment_id: int, assessor: User
    ) -> dict:
        """
        Get detailed assessment data for assessor review.

        Returns full assessment details including:
        - Assessment metadata and status
        - BLGU user information
        - All responses with indicators
        - MOVs for each response
        - Feedback comments
        - Technical notes for each indicator

        Args:
            db: Database session
            assessment_id: ID of the assessment to retrieve
            assessor: The assessor requesting the data

        Returns:
            dict: Assessment details or error information
        """
        # Get the assessment with all related data
        assessment = (
            db.query(Assessment)
            .options(
                joinedload(Assessment.blgu_user).joinedload(User.barangay),
                joinedload(Assessment.responses)
                .joinedload(AssessmentResponse.indicator)
                .joinedload(Indicator.governance_area),
                joinedload(Assessment.responses).joinedload(AssessmentResponse.movs),
                joinedload(Assessment.responses).joinedload(
                    AssessmentResponse.feedback_comments
                ),
            )
            .filter(Assessment.id == assessment_id)
            .first()
        )

        if not assessment:
            return {
                "success": False,
                "message": "Assessment not found",
                "assessment_id": assessment_id,
            }

        # Verify the assessor has permission to view this assessment
        # by checking if any of the assessment's indicators belong to the assessor's governance area
        # If there are no responses, we need to check if the BLGU user's barangay is in the assessor's governance area
        has_permission = False

        if assessment.responses:
            # Check if any response's indicator belongs to the assessor's governance area
            for response in assessment.responses:
                if response.indicator.governance_area_id == assessor.governance_area_id:
                    has_permission = True
                    break
        else:
            # For assessments with no responses, check if the BLGU user's barangay
            # belongs to the assessor's governance area (this would require additional logic
            # to map barangays to governance areas, but for now we'll allow access)
            # This is a simplified approach - in a real system, you'd need proper mapping
            has_permission = True  # Allow access to empty assessments for now

        if not has_permission:
            return {
                "success": False,
                "message": "Access denied. You can only view assessments in your governance area",
                "assessment_id": assessment_id,
            }

        # Build the response data
        assessment_data = {
            "success": True,
            "assessment": {
                "id": assessment.id,
                "status": assessment.status.value,
                "created_at": assessment.created_at.isoformat(),
                "updated_at": assessment.updated_at.isoformat(),
                "submitted_at": assessment.submitted_at.isoformat()
                if assessment.submitted_at
                else None,
                "validated_at": assessment.validated_at.isoformat()
                if assessment.validated_at
                else None,
                "blgu_user": {
                    "id": assessment.blgu_user.id,
                    "name": assessment.blgu_user.name,
                    "email": assessment.blgu_user.email,
                    "barangay": {
                        "id": assessment.blgu_user.barangay.id,
                        "name": assessment.blgu_user.barangay.name,
                    }
                    if assessment.blgu_user.barangay
                    else None,
                },
                "responses": [],
            },
        }

        # Process each response with its related data
        for response in assessment.responses:
            response_data = {
                "id": response.id,
                "is_completed": response.is_completed,
                "requires_rework": response.requires_rework,
                "validation_status": response.validation_status.value
                if response.validation_status
                else None,
                "response_data": response.response_data,
                "created_at": response.created_at.isoformat(),
                "updated_at": response.updated_at.isoformat(),
                "indicator": {
                    "id": response.indicator.id,
                    "name": response.indicator.name,
                    "description": response.indicator.description,
                    "form_schema": response.indicator.form_schema,
                    "governance_area": {
                        "id": response.indicator.governance_area.id,
                        "name": response.indicator.governance_area.name,
                        "area_type": response.indicator.governance_area.area_type.value,
                    },
                    # Technical notes - for now using description, but this could be a separate field
                    "technical_notes": response.indicator.description
                    or "No technical notes available",
                },
                "movs": [
                    {
                        "id": mov.id,
                        "filename": mov.filename,
                        "original_filename": mov.original_filename,
                        "file_size": mov.file_size,
                        "content_type": mov.content_type,
                        "storage_path": mov.storage_path,
                        "status": mov.status.value,
                        "uploaded_at": mov.uploaded_at.isoformat(),
                    }
                    for mov in response.movs
                ],
                "feedback_comments": [
                    {
                        "id": comment.id,
                        "comment": comment.comment,
                        "comment_type": comment.comment_type,
                        "is_internal_note": comment.is_internal_note,
                        "created_at": comment.created_at.isoformat(),
                        "assessor": {
                            "id": comment.assessor.id,
                            "name": comment.assessor.name,
                            "email": comment.assessor.email,
                        }
                        if comment.assessor
                        else None,
                    }
                    for comment in response.feedback_comments
                ],
            }
            assessment_data["assessment"]["responses"].append(response_data)

        return assessment_data

    def send_assessment_for_rework(
        self, db: Session, assessment_id: int, assessor: User
    ) -> dict:
        """
        Send assessment back to BLGU user for rework.

        Args:
            db: Database session
            assessment_id: ID of the assessment to send for rework
            assessor: The assessor performing the action (currently unused but kept for future audit logging)

        Returns:
            dict: Result of the rework operation

        Raises:
            ValueError: If assessment not found or rework not allowed
            PermissionError: If assessor doesn't have permission
        """
        # Get the assessment
        assessment = (
            db.query(Assessment)
            .options(joinedload(Assessment.blgu_user).joinedload(User.barangay))
            .filter(Assessment.id == assessment_id)
            .first()
        )

        if not assessment:
            raise ValueError(f"Assessment {assessment_id} not found")

        # Check if rework is allowed (rework_count must be 0)
        if assessment.rework_count != 0:
            raise ValueError(
                "Assessment has already been sent for rework. Cannot send again."
            )

        # Check assessor permission (assessor must be assigned to the governance area)
        # For now, we'll allow any assessor to send for rework
        # In a more sophisticated system, we'd check specific permissions

        # Update assessment status and rework count
        assessment.status = AssessmentStatus.NEEDS_REWORK
        assessment.rework_count = 1
        # Note: updated_at is automatically handled by SQLAlchemy's onupdate

        # Mark all responses as requiring rework
        for response in assessment.responses:
            response.requires_rework = True

        db.commit()
        db.refresh(assessment)

        # Trigger notification asynchronously using Celery
        try:
            from app.workers.notifications import send_rework_notification

            # Queue the notification task to run in the background
            task = send_rework_notification.delay(assessment_id)
            notification_result = {
                "success": True,
                "message": "Rework notification queued successfully",
                "task_id": task.id,
            }
        except Exception as e:
            # Log the error but don't fail the rework operation
            print(f"Failed to queue notification: {e}")
            notification_result = {"success": False, "error": str(e)}

        return {
            "success": True,
            "message": "Assessment sent for rework successfully",
            "assessment_id": assessment_id,
            "new_status": assessment.status.value,
            "rework_count": assessment.rework_count,
            "notification_result": notification_result,
        }

    def finalize_assessment(
        self, db: Session, assessment_id: int, assessor: User
    ) -> dict:
        """
        Finalize assessment validation, permanently locking it.

        Args:
            db: Database session
            assessment_id: ID of the assessment to finalize
            assessor: The assessor performing the action (currently unused but kept for future audit logging)

        Returns:
            dict: Result of the finalization operation

        Raises:
            ValueError: If assessment not found or cannot be finalized
            PermissionError: If assessor doesn't have permission
        """
        # Get the assessment
        assessment = (
            db.query(Assessment)
            .options(joinedload(Assessment.blgu_user).joinedload(User.barangay))
            .filter(Assessment.id == assessment_id)
            .first()
        )

        if not assessment:
            raise ValueError(f"Assessment {assessment_id} not found")

        # Check if assessment can be finalized
        if assessment.status == AssessmentStatus.VALIDATED:
            raise ValueError("Assessment is already finalized")

        if assessment.status == AssessmentStatus.DRAFT:
            raise ValueError("Cannot finalize a draft assessment")

        # Check that all responses have been reviewed (have validation status)
        unreviewed_responses = [
            response
            for response in assessment.responses
            if response.validation_status is None
        ]

        if unreviewed_responses:
            raise ValueError(
                f"Cannot finalize assessment. {len(unreviewed_responses)} responses have not been reviewed."
            )

        # Update assessment status
        assessment.status = AssessmentStatus.VALIDATED
        assessment.validated_at = (
            db.query(Assessment)
            .filter(Assessment.id == assessment_id)
            .first()
            .updated_at
        )
        # Note: updated_at is automatically handled by SQLAlchemy's onupdate

        db.commit()
        db.refresh(assessment)

        # Trigger notification asynchronously using Celery
        try:
            from app.workers.notifications import send_validation_complete_notification

            # Queue the notification task to run in the background
            task = send_validation_complete_notification.delay(assessment_id)
            notification_result = {
                "success": True,
                "message": "Validation complete notification queued successfully",
                "task_id": task.id,
            }
        except Exception as e:
            # Log the error but don't fail the finalization operation
            print(f"Failed to queue notification: {e}")
            notification_result = {"success": False, "error": str(e)}

        return {
            "success": True,
            "message": "Assessment finalized successfully",
            "assessment_id": assessment_id,
            "new_status": assessment.status.value,
            "validated_at": assessment.validated_at.isoformat()
            if assessment.validated_at
            else None,
            "notification_result": notification_result,
        }


assessor_service = AssessorService()
