# 🧠 Intelligence Worker
# Background tasks for AI-powered insights generation using Gemini API

import logging
from typing import Any, Dict

from app.core.celery_app import celery_app
from app.db.base import SessionLocal
from app.db.enums import AssessmentStatus
from app.db.models import Assessment
from app.services.intelligence_service import intelligence_service
from sqlalchemy.orm import Session

# Configure logging
logger = logging.getLogger(__name__)


def _generate_insights_logic(
    assessment_id: int,
    retry_count: int,
    max_retries: int,
    default_retry_delay: int,
    db: Session | None = None,
) -> Dict[str, Any]:
    """
    Core logic for generating insights (separated for easier testing).

    Args:
        assessment_id: ID of the assessment
        retry_count: Current retry attempt number
        max_retries: Maximum number of retries allowed
        default_retry_delay: Base delay for exponential backoff
        db: Optional database session (for testing)

    Returns:
        dict: Result of the insight generation process
    """
    needs_cleanup = False
    if db is None:
        db = SessionLocal()
        needs_cleanup = True

    try:
        logger.info(
            "Generating AI insights for assessment %s (attempt %s)",
            assessment_id,
            retry_count + 1,
        )

        # Verify assessment exists and is validated
        assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()

        if not assessment:
            error_msg = f"Assessment {assessment_id} not found"
            logger.error(error_msg)
            return {"success": False, "error": error_msg}

        # Check if assessment is validated (required for insights)
        if assessment.status != AssessmentStatus.VALIDATED:
            error_msg = f"Assessment {assessment_id} is not validated. Status: {assessment.status}"
            logger.error(error_msg)
            return {"success": False, "error": error_msg}

        # Generate insights using intelligence service
        # This method handles caching - checks database first before calling API
        insights = intelligence_service.get_insights_with_caching(db, assessment_id)

        logger.info(
            "Successfully generated AI insights for assessment %s",
            assessment_id,
        )

        return {
            "success": True,
            "assessment_id": assessment_id,
            "insights": insights,
            "message": "AI insights generated successfully",
        }

    except ValueError as e:
        # Don't retry on validation errors
        error_msg = str(e)
        logger.error(
            "Validation error generating insights for assessment %s: %s",
            assessment_id,
            error_msg,
        )
        return {"success": False, "error": error_msg}

    except Exception as e:
        # Log error
        error_msg = str(e)
        logger.error(
            "Error generating insights for assessment %s (attempt %s): %s",
            assessment_id,
            retry_count + 1,
            error_msg,
        )

        # Return error (retry logic handled by Celery task wrapper)
        return {"success": False, "error": error_msg}

    finally:
        if needs_cleanup:
            db.close()


@celery_app.task(
    bind=True,
    name="intelligence.generate_insights_task",
    max_retries=3,
    default_retry_delay=60,  # Start with 60 seconds
)
def generate_insights_task(self: Any, assessment_id: int) -> Dict[str, Any]:
    """
    Generate AI-powered insights for an assessment using Gemini API.

    This is a Celery task that runs in the background to handle
    AI insight generation without blocking the main API thread.

    The task:
    1. Calls intelligence_service.get_insights_with_caching()
    2. Which checks cache first, then calls Gemini API if needed
    3. Saves results to ai_recommendations column
    4. Returns success status

    Args:
        assessment_id: ID of the assessment to generate insights for

    Returns:
        dict: Result of the insight generation process
    """
    result = _generate_insights_logic(
        assessment_id, self.request.retries, self.max_retries, self.default_retry_delay
    )

    # If successful, return the result
    if result["success"]:
        return result

    # Handle retry logic for non-validation errors
    if "error" in result:
        # Don't retry on validation errors (ValueError)
        if (
            "not found" in result["error"].lower()
            or "not validated" in result["error"].lower()
        ):
            return result

        # Retry with exponential backoff for other errors
        if self.request.retries < self.max_retries:
            retry_count = self.request.retries + 1
            retry_delay = self.default_retry_delay * (2 ** (retry_count - 1))
            logger.info(
                "Retrying insight generation for assessment %s in %s seconds...",
                assessment_id,
                retry_delay,
            )
            raise self.retry(countdown=retry_delay)

        logger.error(
            "Max retries exceeded for assessment %s. Failing with error: %s",
            assessment_id,
            result["error"],
        )

    return result
