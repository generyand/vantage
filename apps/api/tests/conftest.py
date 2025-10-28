"""
🧪 Test Configuration
Essential testing setup for 2-person team
"""

import sys
from pathlib import Path

# Add the parent directory to Python path so we can import main and app modules
sys.path.insert(0, str(Path(__file__).parent.parent))

import pytest
from app.db.base import Base, get_db
from fastapi.testclient import TestClient
from main import app
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Test database URL (use SQLite for simplicity in tests)
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    """Override database dependency for testing"""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


@pytest.fixture(scope="session")
def db_setup():
    """Create test database tables"""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client(db_setup):
    """FastAPI test client with test database"""
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def db_session(db_setup):
    """Database session for tests with automatic rollback for isolation"""
    db = TestingSessionLocal()

    # Start a savepoint for test isolation
    trans = db.begin()
    try:
        yield db
    finally:
        # Rollback to clean up test data
        db.rollback()
        db.close()


# Sample test data
@pytest.fixture
def sample_user_data():
    """Sample user data for testing"""
    return {
        "email": "test@example.com",
        "name": "Test User",
        "password": "testpassword123",
    }


@pytest.fixture
def mock_barangay(db_session):
    """Create a mock barangay for testing"""
    import uuid

    from app.db.models.barangay import Barangay

    # Use unique name to avoid conflicts
    unique_name = f"Test Barangay {uuid.uuid4().hex[:8]}"

    # Check if it already exists
    existing = db_session.query(Barangay).filter(Barangay.name == unique_name).first()
    if existing:
        return existing

    barangay = Barangay(name=unique_name)
    db_session.add(barangay)
    db_session.commit()
    db_session.refresh(barangay)
    return barangay


@pytest.fixture
def mock_blgu_user(db_session, mock_barangay):
    """Create a mock BLGU user for testing"""
    import uuid

    from app.db.enums import UserRole
    from app.db.models.user import User
    from passlib.context import CryptContext

    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    # Use unique email to avoid conflicts
    unique_email = f"blgu{uuid.uuid4().hex[:8]}@example.com"

    user = User(
        email=unique_email,
        name="BLGU Test User",
        hashed_password=pwd_context.hash("password123"),
        role=UserRole.BLGU_USER,
        barangay_id=mock_barangay.id,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    # Eager load relationships
    db_session.refresh(user)
    if hasattr(user, "barangay"):
        db_session.refresh(user.barangay)

    return user


@pytest.fixture
def mock_assessment(db_session, mock_blgu_user):
    """Create a mock assessment for testing"""
    from datetime import datetime

    from app.db.enums import AssessmentStatus, ComplianceStatus
    from app.db.models.assessment import Assessment

    assessment = Assessment(
        blgu_user_id=mock_blgu_user.id,
        status=AssessmentStatus.VALIDATED,
        final_compliance_status=ComplianceStatus.FAILED,
        area_results={
            "Financial Administration and Sustainability": "Failed",
            "Disaster Preparedness": "Passed",
            "Safety, Peace and Order": "Failed",
        },
        validated_at=datetime(2024, 1, 1),
    )
    db_session.add(assessment)
    db_session.commit()
    db_session.refresh(assessment)

    # Eager load relationships
    db_session.refresh(assessment)
    if hasattr(assessment, "blgu_user"):
        db_session.refresh(assessment.blgu_user)
        if hasattr(assessment.blgu_user, "barangay"):
            db_session.refresh(assessment.blgu_user.barangay)

    return assessment


@pytest.fixture
def mock_assessment_without_barangay(db_session):
    """Create a mock assessment without barangay for testing"""
    import uuid
    from datetime import datetime

    from app.db.enums import AssessmentStatus, UserRole
    from app.db.models.assessment import Assessment
    from app.db.models.user import User
    from passlib.context import CryptContext

    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    # Use unique email to avoid conflicts
    unique_email = f"nobarangay{uuid.uuid4().hex[:8]}@example.com"

    user_no_barangay = User(
        email=unique_email,
        name="User Without Barangay",
        hashed_password=pwd_context.hash("password123"),
        role=UserRole.BLGU_USER,
        barangay_id=None,
    )
    db_session.add(user_no_barangay)
    db_session.commit()
    db_session.refresh(user_no_barangay)

    assessment = Assessment(
        blgu_user_id=user_no_barangay.id,
        status=AssessmentStatus.VALIDATED,
        validated_at=datetime(2024, 1, 1),
    )
    db_session.add(assessment)
    db_session.commit()
    db_session.refresh(assessment)

    # Eager load relationships
    db_session.refresh(assessment)
    if hasattr(assessment, "blgu_user"):
        db_session.refresh(assessment.blgu_user)

    return assessment
