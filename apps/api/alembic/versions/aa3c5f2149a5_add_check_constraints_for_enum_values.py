"""Add CHECK constraints for enum values

Revision ID: aa3c5f2149a5
Revises: f73bc5ceb696
Create Date: 2025-07-19 19:32:43.838592

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'aa3c5f2149a5'
down_revision: Union[str, Sequence[str], None] = 'f73bc5ceb696'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Add CHECK constraint for user role enum values
    op.execute("""
        ALTER TABLE users 
        ADD CONSTRAINT check_user_role 
        CHECK (role IN (1, 2, 3))
    """)
    
    # Add CHECK constraint for governance area type enum values
    op.execute("""
        ALTER TABLE governance_areas 
        ADD CONSTRAINT check_governance_area_type 
        CHECK (area_type IN (1, 2))
    """)


def downgrade() -> None:
    """Downgrade schema."""
    # Remove CHECK constraint for governance area type
    op.execute("ALTER TABLE governance_areas DROP CONSTRAINT check_governance_area_type")
    
    # Remove CHECK constraint for user role
    op.execute("ALTER TABLE users DROP CONSTRAINT check_user_role")
