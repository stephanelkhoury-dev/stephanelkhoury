"""initial migration

Revision ID: 001
Revises: 
Create Date: 2025-06-16 14:30:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Create projects table
    op.create_table(
        'projects',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('organization_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('description', sa.Text),
        sa.Column('status', sa.String(50), default='active'),
        sa.Column('start_date', sa.Date),
        sa.Column('end_date', sa.Date),
        sa.Column('settings', postgresql.JSONB, default={}),
        sa.Column('created_by', postgresql.UUID(as_uuid=True)),
        sa.Column('created_at', sa.DateTime, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime, server_default=sa.text('now()'))
    )

    # Create boards table
    op.create_table(
        'boards',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('project_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('description', sa.Text),
        sa.Column('board_type', sa.String(50), default='kanban'),
        sa.Column('settings', postgresql.JSONB, default={}),
        sa.Column('position', sa.Integer, default=0),
        sa.Column('created_at', sa.DateTime, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime, server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['project_id'], ['projects.id'], ondelete='CASCADE')
    )

    # Create indexes
    op.create_index('ix_projects_organization_id', 'projects', ['organization_id'])
    op.create_index('ix_boards_project_id', 'boards', ['project_id'])

def downgrade() -> None:
    op.drop_table('boards')
    op.drop_table('projects')
