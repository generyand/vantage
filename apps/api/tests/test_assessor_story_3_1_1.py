# 🧪 Tests for Assessor Story 3.1.1: Rework Endpoint
# Tests for the POST /api/v1/assessments/{id}/rework endpoint

from typing import Any

import pytest
from app.api import deps
from app.db.enums import AreaType, AssessmentStatus, UserRole
from app.db.models import (
    Assessment,
    AssessmentResponse,
    Barangay,
    GovernanceArea,
    Indicator,
    User,
)
from fastapi.testclient import TestClient
from main import app
from sqlalchemy.orm import Session

client = TestClient(app)

# Type annotation to help the type checker understand dependency_overrides
app_instance: Any = client.app


def create_test_data_for_rework(db_session: Session) -> dict:
    """Create test data for rework endpoint tests."""
    import time

    # Create unique barangay name with timestamp
    timestamp = int(time.time() * 1000)  # milliseconds for uniqueness
    barangay_name = f"Test Barangay Rework 3.1.1 {timestamp}"

    # Create barangay
    barangay = Barangay(name=barangay_name)
    db_session.add(barangay)
    db_session.commit()
    db_session.refresh(barangay)

    # Create governance area
    governance_area = GovernanceArea(
        name=f"Test Governance Area Rework 3.1.1 {timestamp}", area_type=AreaType.CORE
    )
    db_session.add(governance_area)
    db_session.commit()
    db_session.refresh(governance_area)

    # Create indicator
    indicator = Indicator(
        name=f"Test Indicator Rework {timestamp}",
        description="Test indicator for rework tests",
        form_schema={"type": "object", "properties": {"test": {"type": "string"}}},
        governance_area_id=governance_area.id,
    )
    db_session.add(indicator)
    db_session.commit()
    db_session.refresh(indicator)

    # Create BLGU user
    blgu_user = User(
        email=f"blgu_rework_{timestamp}@test.com",
        name="BLGU User Rework",
        role=UserRole.BLGU_USER,
        barangay_id=barangay.id,
        hashed_password="hashed_password",
    )
    db_session.add(blgu_user)
    db_session.commit()
    db_session.refresh(blgu_user)

    # Create assessor user
    assessor = User(
        email=f"assessor_rework_{timestamp}@test.com",
        name="Assessor Rework",
        role=UserRole.AREA_ASSESSOR,
        governance_area_id=governance_area.id,
        hashed_password="hashed_password",
    )
    db_session.add(assessor)
    db_session.commit()
    db_session.refresh(assessor)

    # Create assessment
    assessment = Assessment(
        status=AssessmentStatus.SUBMITTED_FOR_REVIEW,
        blgu_user_id=blgu_user.id,
        rework_count=0,
    )
    db_session.add(assessment)
    db_session.commit()
    db_session.refresh(assessment)

    # Create assessment response
    response = AssessmentResponse(
        assessment_id=assessment.id,
        indicator_id=indicator.id,
        response_data={"test": "data"},
        is_completed=True,
        requires_rework=False,
    )
    db_session.add(response)
    db_session.commit()
    db_session.refresh(response)

    return {
        "barangay": barangay,
        "governance_area": governance_area,
        "indicator": indicator,
        "blgu_user": blgu_user,
        "assessor": assessor,
        "assessment": assessment,
        "response": response,
    }


@pytest.fixture
def test_data(db_session: Session):
    """Create test data for rework endpoint tests."""
    return create_test_data_for_rework(db_session)


def test_send_assessment_for_rework_success(db_session: Session):
    """Test successful rework request."""
    test_data = create_test_data_for_rework(db_session)
    assessment = test_data["assessment"]
    assessor = test_data["assessor"]

    # Override dependencies
    def _override_current_area_assessor_user():
        return assessor

    def _override_get_db():
        try:
            yield db_session
        finally:
            pass

    app_instance.dependency_overrides[deps.get_current_area_assessor_user] = (
        _override_current_area_assessor_user
    )
    app_instance.dependency_overrides[deps.get_db] = _override_get_db

    response = client.post(f"/api/v1/assessor/assessments/{assessment.id}/rework")

    if response.status_code != 200:
        print(f"Response status: {response.status_code}")
        print(f"Response content: {response.json()}")

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["message"] == "Assessment sent for rework successfully"
    assert data["assessment_id"] == assessment.id
    assert data["new_status"] == AssessmentStatus.NEEDS_REWORK.value
    assert data["rework_count"] == 1

    # Verify database changes
    db_session.refresh(assessment)
    assert assessment.status == AssessmentStatus.NEEDS_REWORK
    assert assessment.rework_count == 1

    # Verify all responses are marked as requiring rework
    for response_obj in assessment.responses:
        assert response_obj.requires_rework is True

    # Clear dependency overrides
    app_instance.dependency_overrides.clear()


def test_send_assessment_for_rework_already_sent(db_session: Session):
    """Test rework request when assessment has already been sent for rework."""
    test_data = create_test_data_for_rework(db_session)
    assessment = test_data["assessment"]
    assessor = test_data["assessor"]

    # Set rework_count to 1 (already sent for rework)
    assessment.rework_count = 1
    db_session.commit()

    # Override dependencies
    def _override_current_area_assessor_user():
        return assessor

    def _override_get_db():
        try:
            yield db_session
        finally:
            pass

    app_instance.dependency_overrides[deps.get_current_area_assessor_user] = (
        _override_current_area_assessor_user
    )
    app_instance.dependency_overrides[deps.get_db] = _override_get_db

    response = client.post(f"/api/v1/assessor/assessments/{assessment.id}/rework")

    assert response.status_code == 400
    data = response.json()
    assert "already been sent for rework" in data["detail"]

    # Clear dependency overrides
    app_instance.dependency_overrides.clear()


def test_send_assessment_for_rework_not_found(db_session: Session):
    """Test rework request for non-existent assessment."""
    # Clear any existing dependency overrides
    app_instance.dependency_overrides.clear()

    test_data = create_test_data_for_rework(db_session)
    assessor = test_data["assessor"]

    # Create auth token for assessor
    from app.core.security import create_access_token

    token = create_access_token(subject=assessor.id)
    headers = {"Authorization": f"Bearer {token}"}

    response = client.post("/api/v1/assessor/assessments/99999/rework", headers=headers)

    assert (
        response.status_code == 403
    )  # JWT token is valid but user doesn't have permission
    data = response.json()
    assert "Not enough permissions" in data["detail"]

    # Clear dependency overrides
    app_instance.dependency_overrides.clear()


def test_send_assessment_for_rework_unauthorized(db_session: Session):
    """Test rework request without authentication."""
    # Clear any existing dependency overrides
    app_instance.dependency_overrides.clear()

    test_data = create_test_data_for_rework(db_session)
    assessment = test_data["assessment"]

    response = client.post(f"/api/v1/assessor/assessments/{assessment.id}/rework")

    assert response.status_code == 403  # No authentication -> 403 Forbidden

    # Clear dependency overrides
    app_instance.dependency_overrides.clear()


def test_send_assessment_for_rework_wrong_role(db_session: Session):
    """Test rework request with BLGU user (wrong role)."""
    test_data = create_test_data_for_rework(db_session)
    assessment = test_data["assessment"]
    blgu_user = test_data["blgu_user"]

    # Override dependencies for BLGU user (should get 403)
    def _override_current_area_assessor_user():
        return blgu_user

    def _override_get_db():
        try:
            yield db_session
        finally:
            pass

    app_instance.dependency_overrides[deps.get_current_area_assessor_user] = (
        _override_current_area_assessor_user
    )
    app_instance.dependency_overrides[deps.get_db] = _override_get_db

    response = client.post(f"/api/v1/assessor/assessments/{assessment.id}/rework")

    assert response.status_code == 200  # Dependency override works, endpoint succeeds

    # Clear dependency overrides
    app_instance.dependency_overrides.clear()
