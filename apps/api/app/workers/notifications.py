# 📧 Notification Worker
# Background tasks for handling notifications

import logging
from typing import Any, Dict

from app.core.celery_app import celery_app
from app.db.base import SessionLocal
from app.db.models import Assessment, User
from sqlalchemy.orm import Session

# Configure logging
logger = logging.getLogger(__name__)


@celery_app.task(bind=True, name="notifications.send_rework_notification")
def send_rework_notification(self: Any, assessment_id: int) -> Dict[str, Any]:
    """
    Send notification to BLGU user when assessment needs rework.

    This is a Celery task that runs in the background to handle
    rework notifications without blocking the main API thread.

    Args:
        assessment_id: ID of the assessment that needs rework

    Returns:
        dict: Result of the notification process
    """
    db: Session = SessionLocal()

    try:
        # Get the assessment with BLGU user details
        assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()

        if not assessment:
            logger.error("Assessment %s not found", assessment_id)
            return {"success": False, "error": "Assessment not found"}

        # Get BLGU user details
        blgu_user = db.query(User).filter(User.id == assessment.blgu_user_id).first()

        if not blgu_user:
            logger.error(
                "BLGU user %s not found for assessment %s",
                assessment.blgu_user_id,
                assessment_id,
            )
            return {"success": False, "error": "BLGU user not found"}

        # Log the notification (for now, email integration will come later)
        logger.info(
            "REWORK NOTIFICATION: Assessment %s needs rework. BLGU User: %s (%s)",
            assessment_id,
            blgu_user.name,
            blgu_user.email,
        )

        # TODO: In the future, this is where we would:
        # 1. Send email notification to BLGU user
        # 2. Send SMS notification if configured
        # 3. Create in-app notification
        # 4. Send webhook notification to external systems

        # For now, we'll just log the notification details
        notification_details = {
            "assessment_id": assessment_id,
            "blgu_user_name": blgu_user.name,
            "blgu_user_email": blgu_user.email,
            "barangay": blgu_user.barangay.name if blgu_user.barangay else "Unknown",
            "assessment_status": assessment.status,
            "rework_count": assessment.rework_count,
            "message": f"Your assessment for {blgu_user.barangay.name if blgu_user.barangay else 'your barangay'} needs rework. Please review the assessor feedback and resubmit.",
        }

        logger.info("Notification details: %s", notification_details)

        return {
            "success": True,
            "message": "Rework notification sent successfully",
            "notification_details": notification_details,
        }

    except Exception as e:
        logger.error(
            "Error sending rework notification for assessment %s: %s",
            assessment_id,
            str(e),
        )
        return {"success": False, "error": str(e)}

    finally:
        db.close()


@celery_app.task(bind=True, name="notifications.send_validation_complete_notification")
def send_validation_complete_notification(
    self: Any, assessment_id: int
) -> Dict[str, Any]:
    """
    Send notification to BLGU user when assessment validation is complete.

    This is a Celery task that runs in the background to handle
    validation complete notifications without blocking the main API thread.

    Args:
        assessment_id: ID of the validated assessment

    Returns:
        dict: Result of the notification process
    """
    db: Session = SessionLocal()

    try:
        # Get the assessment with BLGU user details
        assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()

        if not assessment:
            logger.error("Assessment %s not found", assessment_id)
            return {"success": False, "error": "Assessment not found"}

        # Get BLGU user details
        blgu_user = db.query(User).filter(User.id == assessment.blgu_user_id).first()

        if not blgu_user:
            logger.error(
                "BLGU user %s not found for assessment %s",
                assessment.blgu_user_id,
                assessment_id,
            )
            return {"success": False, "error": "BLGU user not found"}

        # Log the notification
        logger.info(
            "VALIDATION COMPLETE NOTIFICATION: Assessment %s has been validated. BLGU User: %s (%s)",
            assessment_id,
            blgu_user.name,
            blgu_user.email,
        )

        # TODO: In the future, this is where we would send actual notifications

        notification_details = {
            "assessment_id": assessment_id,
            "blgu_user_name": blgu_user.name,
            "blgu_user_email": blgu_user.email,
            "barangay": blgu_user.barangay.name if blgu_user.barangay else "Unknown",
            "assessment_status": assessment.status,
            "message": f"Congratulations! Your assessment for {blgu_user.barangay.name if blgu_user.barangay else 'your barangay'} has been validated and is now complete.",
        }

        logger.info(
            "Validation complete notification details: %s", notification_details
        )

        return {
            "success": True,
            "message": "Validation complete notification sent successfully",
            "notification_details": notification_details,
        }

    except Exception as e:
        logger.error(
            "Error sending validation complete notification for assessment %s: %s",
            assessment_id,
            str(e),
        )
        return {"success": False, "error": str(e)}

    finally:
        db.close()
