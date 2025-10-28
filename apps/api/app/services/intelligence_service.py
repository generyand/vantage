# 🧠 Intelligence Service
# Business logic for SGLGB compliance classification and AI-powered insights

from datetime import UTC, datetime
from typing import Any

from app.db.enums import ComplianceStatus, ValidationStatus
from app.db.models.assessment import Assessment, AssessmentResponse
from app.db.models.governance_area import GovernanceArea, Indicator
from sqlalchemy.orm import Session

# Core governance areas (must all pass for compliance)
CORE_AREAS = [
    "Financial Administration and Sustainability",
    "Disaster Preparedness",
    "Safety, Peace and Order",
]

# Essential governance areas (at least one must pass for compliance)
ESSENTIAL_AREAS = [
    "Social Protection and Sensitivity",
    "Business-Friendliness and Competitiveness",
    "Environmental Management",
]


class IntelligenceService:
    def get_validated_responses_by_area(
        self, db: Session, assessment_id: int
    ) -> dict[str, list[AssessmentResponse]]:
        """
        Fetch all assessment responses for an assessment, filtered by validation_status='Pass'.

        Groups responses by governance area name.

        Args:
            db: Database session
            assessment_id: ID of the assessment

        Returns:
            Dictionary mapping governance area name to list of passed responses
        """
        responses = (
            db.query(AssessmentResponse)
            .join(Indicator, AssessmentResponse.indicator_id == Indicator.id)
            .join(GovernanceArea, Indicator.governance_area_id == GovernanceArea.id)
            .filter(
                AssessmentResponse.assessment_id == assessment_id,
                AssessmentResponse.validation_status == ValidationStatus.PASS,
            )
            .all()
        )

        # Group by governance area name
        area_responses: dict[str, list[AssessmentResponse]] = {}
        for response in responses:
            area_name = response.indicator.governance_area.name
            if area_name not in area_responses:
                area_responses[area_name] = []
            area_responses[area_name].append(response)

        return area_responses

    def determine_area_compliance(
        self, db: Session, assessment_id: int, area_name: str
    ) -> bool:
        """
        Determine if a governance area has passed (all indicators within that area must pass).

        An area passes if ALL of its indicators have validation_status = 'Pass'.
        An area fails if ANY indicator has validation_status != 'Pass' or is None.

        Args:
            db: Database session
            assessment_id: ID of the assessment
            area_name: Name of the governance area to check

        Returns:
            True if all indicators in the area passed, False otherwise
        """
        # Get all indicators for this governance area
        area = db.query(GovernanceArea).filter(GovernanceArea.name == area_name).first()
        if not area:
            return False

        indicators = (
            db.query(Indicator).filter(Indicator.governance_area_id == area.id).all()
        )

        if not indicators:
            return False  # No indicators = failed area

        # Check all responses for this assessment and area
        for indicator in indicators:
            response = (
                db.query(AssessmentResponse)
                .filter(
                    AssessmentResponse.assessment_id == assessment_id,
                    AssessmentResponse.indicator_id == indicator.id,
                )
                .first()
            )

            # If no response exists, or if validation status is not PASS, the area fails
            if not response or response.validation_status != ValidationStatus.PASS:
                return False

        return True

    def get_all_area_results(self, db: Session, assessment_id: int) -> dict[str, str]:
        """
        Get pass/fail status for all six governance areas.

        Returns a dictionary mapping area names to their status ('Passed' or 'Failed').

        Args:
            db: Database session
            assessment_id: ID of the assessment

        Returns:
            Dictionary mapping area name to status
        """
        area_results: dict[str, str] = {}

        # Check all six areas
        all_areas = CORE_AREAS + ESSENTIAL_AREAS

        for area_name in all_areas:
            if self.determine_area_compliance(db, assessment_id, area_name):
                area_results[area_name] = "Passed"
            else:
                area_results[area_name] = "Failed"

        return area_results

    def check_core_areas_compliance(self, db: Session, assessment_id: int) -> bool:
        """
        Check if all three Core areas have passed.

        Returns True if all three Core areas (Financial, Disaster Prep, Safety/Peace/Order) have passed.

        Args:
            db: Database session
            assessment_id: ID of the assessment

        Returns:
            True if all Core areas passed, False otherwise
        """
        for area_name in CORE_AREAS:
            if not self.determine_area_compliance(db, assessment_id, area_name):
                return False
        return True

    def check_essential_areas_compliance(self, db: Session, assessment_id: int) -> bool:
        """
        Check if at least one Essential area has passed.

        Returns True if at least one Essential area has passed.

        Args:
            db: Database session
            assessment_id: ID of the assessment

        Returns:
            True if at least one Essential area passed, False otherwise
        """
        for area_name in ESSENTIAL_AREAS:
            if self.determine_area_compliance(db, assessment_id, area_name):
                return True
        return False

    def determine_compliance_status(
        self, db: Session, assessment_id: int
    ) -> ComplianceStatus:
        """
        Determine overall compliance status using the "3+1" SGLGB rule.

        A barangay PASSES if:
        - All three (3) Core areas are marked as "Passed" AND
        - At least one (1) Essential area is marked as "Passed"

        A barangay FAILS if:
        - Any one of the three Core areas is failed, OR
        - All three Essential areas are failed

        Args:
            db: Database session
            assessment_id: ID of the assessment

        Returns:
            ComplianceStatus.PASSED or ComplianceStatus.FAILED
        """
        # Check Core areas compliance
        all_core_passed = self.check_core_areas_compliance(db, assessment_id)

        # Check Essential areas compliance
        at_least_one_essential_passed = self.check_essential_areas_compliance(
            db, assessment_id
        )

        # Apply "3+1" rule
        if all_core_passed and at_least_one_essential_passed:
            return ComplianceStatus.PASSED
        else:
            return ComplianceStatus.FAILED

    def classify_assessment(self, db: Session, assessment_id: int) -> dict[str, Any]:
        """
        Run the complete classification algorithm and store results.

        This method:
        1. Calculates area-level compliance (all indicators must pass)
        2. Applies the "3+1" rule to determine overall compliance status
        3. Stores results in the database

        Args:
            db: Database session
            assessment_id: ID of the assessment to classify

        Returns:
            Dictionary with classification results

        Raises:
            ValueError: If assessment not found
        """
        # Verify assessment exists
        assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
        if not assessment:
            raise ValueError(f"Assessment {assessment_id} not found")

        # Get area-level results
        area_results = self.get_all_area_results(db, assessment_id)

        # Determine overall compliance status using "3+1" rule
        compliance_status = self.determine_compliance_status(db, assessment_id)

        # Store results in database
        assessment.final_compliance_status = compliance_status
        assessment.area_results = area_results
        assessment.updated_at = datetime.now(UTC)

        db.commit()
        db.refresh(assessment)

        return {
            "success": True,
            "assessment_id": assessment_id,
            "final_compliance_status": compliance_status.value,
            "area_results": area_results,
        }


intelligence_service = IntelligenceService()
