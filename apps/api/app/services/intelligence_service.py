# 🧠 Intelligence Service
# Business logic for SGLGB compliance classification and AI-powered insights

import json
from datetime import UTC, datetime
from typing import Any

import google.generativeai as genai
from app.core.config import settings
from app.db.enums import ComplianceStatus, ValidationStatus
from app.db.models.assessment import Assessment, AssessmentResponse
from app.db.models.governance_area import GovernanceArea, Indicator
from sqlalchemy.orm import Session, joinedload

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

    def build_gemini_prompt(self, db: Session, assessment_id: int) -> str:
        """
        Build a structured prompt for Gemini API from failed indicators.

        Creates a comprehensive prompt that includes:
        - Barangay name and assessment year
        - Failed indicators with governance area context
        - Assessor comments and feedback
        - Overall compliance status

        Args:
            db: Database session
            assessment_id: ID of the assessment

        Returns:
            Formatted prompt string for Gemini API

        Raises:
            ValueError: If assessment not found
        """
        # Get assessment with all relationships
        from app.db.models.user import User

        assessment = (
            db.query(Assessment)
            .options(
                joinedload(Assessment.blgu_user).joinedload(User.barangay),
                joinedload(Assessment.responses)
                .joinedload(AssessmentResponse.indicator)
                .joinedload(Indicator.governance_area),
                joinedload(Assessment.responses).joinedload(
                    AssessmentResponse.feedback_comments
                ),
            )
            .filter(Assessment.id == assessment_id)
            .first()
        )

        if not assessment:
            raise ValueError(f"Assessment {assessment_id} not found")

        # Get barangay name
        barangay_name = "Unknown"
        if assessment.blgu_user and assessment.blgu_user.barangay:
            barangay_name = assessment.blgu_user.barangay.name

        # Get assessment year
        assessment_year = "2024"  # Default
        if assessment.validated_at:
            assessment_year = str(assessment.validated_at.year)

        # Get failed indicators with feedback
        failed_indicators = []
        for response in assessment.responses:
            if response.validation_status != ValidationStatus.PASS:
                indicator = response.indicator
                governance_area = indicator.governance_area

                # Get assessor comments
                comments = []
                for comment in response.feedback_comments:
                    comments.append(
                        f"{comment.assessor.name if comment.assessor else 'Assessor'}: {comment.comment}"
                    )

                failed_indicators.append(
                    {
                        "indicator_name": indicator.name,
                        "description": indicator.description,
                        "governance_area": governance_area.name,
                        "area_type": governance_area.area_type.value,
                        "assessor_comments": comments,
                    }
                )

        # Get overall compliance status
        compliance_status = (
            assessment.final_compliance_status.value
            if assessment.final_compliance_status
            else "Not yet classified"
        )

        # Build the prompt
        prompt = f"""You are an expert consultant analyzing SGLGB (Seal of Good Local Governance - Barangay) compliance assessment results.

BARANGAY INFORMATION:
- Name: {barangay_name}
- Assessment Year: {assessment_year}
- Overall Compliance Status: {compliance_status}

FAILED INDICATORS:
"""

        for idx, indicator in enumerate(failed_indicators, 1):
            prompt += f"""
{idx}. {indicator["indicator_name"]}
   - Governance Area: {indicator["governance_area"]} ({indicator["area_type"]})
   - Description: {indicator["description"]}
"""

            if indicator["assessor_comments"]:
                prompt += "   - Assessor Feedback:\n"
                for comment in indicator["assessor_comments"]:
                    prompt += f"     • {comment}\n"

        prompt += """

TASK:
Based on the failed indicators and assessor feedback above, provide a comprehensive analysis in the following JSON structure:

{
  "summary": "A brief 2-3 sentence summary of the barangay's compliance status and key issues",
  "recommendations": [
    "Specific actionable recommendation 1",
    "Specific actionable recommendation 2",
    "..."
  ],
  "capacity_development_needs": [
    "Identified capacity building need 1",
    "Identified capacity building need 2",
    "..."
  ]
}

Focus on:
1. Identifying root causes of non-compliance
2. Providing actionable recommendations for improvement
3. Identifying specific capacity development needs for barangay officials and staff
"""

        return prompt

    def call_gemini_api(self, db: Session, assessment_id: int) -> dict[str, Any]:
        """
        Call Gemini API with the prompt and parse the JSON response.

        Builds the prompt from failed indicators, calls Gemini API,
        and returns the structured JSON response.

        Args:
            db: Database session
            assessment_id: ID of the assessment

        Returns:
            Dictionary with 'summary', 'recommendations', and 'capacity_development_needs' keys

        Raises:
            ValueError: If assessment not found or API key not configured
            Exception: If API call fails or response parsing fails
        """
        # Check if API key is configured
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY not configured in environment")

        # Build the prompt
        prompt = self.build_gemini_prompt(db, assessment_id)

        # Configure Gemini
        genai.configure(api_key=settings.GEMINI_API_KEY)  # type: ignore

        # Initialize the model
        # Using Gemini 2.5 Flash (latest stable as of Oct 2025)
        # Supports up to 1M input tokens and 65K output tokens
        model = genai.GenerativeModel("gemini-2.5-flash")  # type: ignore

        try:
            # Call the API with generation configuration
            # Using type: ignore due to incomplete type stubs in google-generativeai
            generation_config = {
                "temperature": 0.7,
                "max_output_tokens": 8192,
            }

            response = model.generate_content(
                prompt,
                generation_config=generation_config,  # type: ignore
            )

            # Parse the response text
            if not response or not hasattr(response, "text") or not response.text:
                raise Exception("Gemini API returned empty or invalid response")

            response_text = response.text

            # Try to extract JSON from the response
            # The response might be wrapped in markdown code blocks
            if "```json" in response_text:
                # Extract JSON from code block
                start = response_text.find("```json") + 7
                end = response_text.find("```", start)
                json_str = response_text[start:end].strip()
            elif "```" in response_text:
                # Extract JSON from code block (without json tag)
                start = response_text.find("```") + 3
                end = response_text.find("```", start)
                json_str = response_text[start:end].strip()
            else:
                # Assume the entire response is JSON
                json_str = response_text.strip()

            # Parse the JSON
            parsed_response = json.loads(json_str)

            # Validate the response structure
            required_keys = ["summary", "recommendations", "capacity_development_needs"]
            if not all(key in parsed_response for key in required_keys):
                raise ValueError(
                    f"Gemini API response missing required keys. Got: {list(parsed_response.keys())}"
                )

            return parsed_response

        except json.JSONDecodeError as e:
            raise Exception(
                f"Failed to parse Gemini API response as JSON: {response_text}"
            ) from e
        except TimeoutError as e:
            raise Exception(
                "Gemini API request timed out after waiting for response"
            ) from e
        except ValueError:
            # Re-raise ValueError as-is (for invalid response structure)
            raise
        except Exception as e:
            # Handle various API errors
            error_message = str(e).lower()
            if "quota" in error_message or "rate limit" in error_message:
                raise Exception(
                    "Gemini API quota exceeded or rate limit hit. Please try again later."
                ) from e
            elif "network" in error_message or "connection" in error_message:
                raise Exception(
                    "Network error connecting to Gemini API. Please check your internet connection."
                ) from e
            elif "permission" in error_message or "unauthorized" in error_message:
                raise Exception(
                    "Gemini API authentication failed. Please check your API key."
                ) from e
            else:
                raise Exception(f"Gemini API call failed: {str(e)}") from e

    def get_insights_with_caching(
        self, db: Session, assessment_id: int
    ) -> dict[str, Any]:
        """
        Get AI-powered insights for an assessment with caching.

        First checks if ai_recommendations already exists in the database.
        If cached data exists, returns it immediately without calling Gemini API.
        If not, calls Gemini API, stores the result, and returns it.

        This method implements cost-saving logic by avoiding duplicate API calls.

        Args:
            db: Database session
            assessment_id: ID of the assessment

        Returns:
            Dictionary with 'summary', 'recommendations', and 'capacity_development_needs' keys

        Raises:
            ValueError: If assessment not found
            Exception: If API call fails or response parsing fails
        """
        # Get assessment to check for cached recommendations
        assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
        if not assessment:
            raise ValueError(f"Assessment {assessment_id} not found")

        # Check if ai_recommendations already exists (caching)
        if assessment.ai_recommendations:
            return assessment.ai_recommendations

        # No cached data, call Gemini API
        insights = self.call_gemini_api(db, assessment_id)

        # Store the recommendations in the database for future use
        assessment.ai_recommendations = insights
        assessment.updated_at = datetime.now(UTC)
        db.commit()
        db.refresh(assessment)

        return insights


intelligence_service = IntelligenceService()
