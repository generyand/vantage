"""Alter user table and add governance areas

Revision ID: f73bc5ceb696
Revises: 96ccc23e5224
Create Date: 2025-01-19 18:55:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "f73bc5ceb696"
down_revision: Union[str, Sequence[str], None] = "96ccc23e5224"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # First, create the governance_areas table
    op.create_table(
        "governance_areas",
        sa.Column("id", sa.SmallInteger(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("area_type", sa.SmallInteger(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name"),
    )
    op.create_index(
        op.f("ix_governance_areas_id"), "governance_areas", ["id"], unique=False
    )

    # Now alter the users table
    # Note: For this migration to work, we assume the existing user IDs are numeric strings
    # or we need to handle this conversion in the application layer first

    # Add the new assessor_area column first
    op.add_column("users", sa.Column("assessor_area", sa.SmallInteger(), nullable=True))

    # Convert role from string to integer (this may need manual data migration)
    # First, update role values to integers based on existing string values
    op.execute("""
        UPDATE users SET role = CASE
            WHEN role = 'BLGU User' THEN 1
            WHEN role = 'Area Assessor' THEN 2  
            WHEN role = 'System Admin' THEN 3
            ELSE 1
        END
    """)

    # Remove the default constraint first
    op.execute("ALTER TABLE users ALTER COLUMN role DROP DEFAULT")

    # Now alter the column type using the USING clause
    op.execute("ALTER TABLE users ALTER COLUMN role TYPE SMALLINT USING role::SMALLINT")

    # Add the new default value
    op.execute("ALTER TABLE users ALTER COLUMN role SET DEFAULT 1")

    # For the ID conversion, assign new sequential integer IDs
    # Create a new integer ID column
    op.add_column("users", sa.Column("id_new", sa.Integer(), nullable=True))

    # Create a sequence for new IDs and assign them
    op.execute("CREATE SEQUENCE user_id_seq;")
    op.execute("UPDATE users SET id_new = nextval('user_id_seq');")

    # Drop the old id column and constraints
    op.drop_constraint("users_pkey", "users", type_="primary")
    op.drop_column("users", "id")

    # Rename the new column and make it the primary key
    op.alter_column("users", "id_new", new_column_name="id", nullable=False)
    op.create_primary_key("users_pkey", "users", ["id"])

    # Set the sequence to be owned by the column for autoincrement behavior
    op.execute("ALTER SEQUENCE user_id_seq OWNED BY users.id;")
    op.execute("ALTER TABLE users ALTER COLUMN id SET DEFAULT nextval('user_id_seq');")


def downgrade() -> None:
    """Downgrade schema."""
    # Warning: This downgrade will generate new string IDs and lose relationships

    # Reverse the ID column changes
    op.execute("ALTER TABLE users ALTER COLUMN id DROP DEFAULT;")
    op.execute("DROP SEQUENCE IF EXISTS user_id_seq;")
    op.drop_constraint("users_pkey", "users", type_="primary")
    op.add_column("users", sa.Column("id_old", sa.VARCHAR(), nullable=True))

    # Generate new UUID-like string IDs
    op.execute(
        "UPDATE users SET id_old = 'user_' || id::varchar || '_' || extract(epoch from now())::bigint::varchar"
    )
    op.drop_column("users", "id")
    op.alter_column("users", "id_old", new_column_name="id", nullable=False)
    op.create_primary_key("users_pkey", "users", ["id"])

    # Reverse role conversion
    op.execute("ALTER TABLE users ALTER COLUMN role DROP DEFAULT")
    op.execute("ALTER TABLE users ALTER COLUMN role TYPE VARCHAR USING role::VARCHAR")

    op.execute("""
        UPDATE users SET role = CASE
            WHEN role::integer = 1 THEN 'BLGU User'
            WHEN role::integer = 2 THEN 'Area Assessor'
            WHEN role::integer = 3 THEN 'System Admin'
            ELSE 'BLGU User'
        END
    """)

    op.execute("ALTER TABLE users ALTER COLUMN role SET DEFAULT 'BLGU User'")

    # Drop the assessor_area column
    op.drop_column("users", "assessor_area")

    # Drop governance_areas table
    op.drop_index(op.f("ix_governance_areas_id"), table_name="governance_areas")
    op.drop_table("governance_areas")
