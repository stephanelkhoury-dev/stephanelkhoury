from datetime import datetime
from typing import Dict, List
from uuid import UUID, uuid4

from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, JSON, Date
from sqlalchemy.dialects.postgresql import UUID as PostgresUUID
from sqlalchemy.orm import relationship

from app.db.base_class import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(PostgresUUID, primary_key=True, default=uuid4)
    organization_id = Column(PostgresUUID, ForeignKey("organizations.id", ondelete="CASCADE"))
    name = Column(String(255), nullable=False)
    description = Column(String)
    status = Column(String(50), default="active")
    start_date = Column(Date)
    end_date = Column(Date)
    settings = Column(JSON, default={})
    created_by = Column(PostgresUUID, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    boards = relationship("Board", back_populates="project", cascade="all, delete-orphan")

class Board(Base):
    __tablename__ = "boards"

    id = Column(PostgresUUID, primary_key=True, default=uuid4)
    project_id = Column(PostgresUUID, ForeignKey("projects.id", ondelete="CASCADE"))
    name = Column(String(255), nullable=False)
    description = Column(String)
    board_type = Column(String(50), default="kanban")
    settings = Column(JSON, default={})
    position = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    project = relationship("Project", back_populates="boards")
    columns = relationship("Column", back_populates="board", cascade="all, delete-orphan")
