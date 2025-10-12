# 🎯 Database Enums
# Python enums for database fields to improve type safety and code readability

import enum


class UserRole(str, enum.Enum):
    """
    Enum for user roles.

    Using a string-based enum improves readability and maintainability.
    """

    SUPERADMIN = "SUPERADMIN"
    MLGOO_DILG = "MLGOO_DILG"
    AREA_ASSESSOR = "AREA_ASSESSOR"
    BLGU_USER = "BLGU_USER"


class AreaType(str, enum.Enum):
    """
    Enum for the type of governance area (Core or Essential).
    """

    CORE = "Core"
    ESSENTIAL = "Essential"


class AssessmentStatus(str, enum.Enum):
    """
    Enum for assessment status throughout the workflow.
    """

    DRAFT = "Draft"
    SUBMITTED_FOR_REVIEW = "Submitted for Review"
    VALIDATED = "Validated"
    NEEDS_REWORK = "Needs Rework"


class MOVStatus(str, enum.Enum):
    """
    Enum for MOV (Means of Verification) file status.
    """

    PENDING = "Pending"
    UPLOADED = "Uploaded"
    DELETED = "Deleted"
