# 🎯 Database Enums
# Python enums for database fields to improve type safety and code readability

from enum import IntEnum


class UserRole(IntEnum):
    """
    User role enumeration for the role field in the users table.
    
    Using IntEnum allows storage as integers in the database while providing
    type safety and readability in Python code.
    """
    BLGU_USER = 1
    AREA_ASSESSOR = 2
    SYSTEM_ADMIN = 3


class GovernanceAreaType(IntEnum):
    """
    Governance area type enumeration for the area_type field in governance_areas table.
    
    Categorizes SGLGB governance areas into Core and Essential types.
    """
    CORE = 1
    ESSENTIAL = 2 