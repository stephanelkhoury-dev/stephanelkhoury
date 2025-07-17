from datetime import date, datetime
from typing import Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel, Field

# Shared properties
class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    status: str = "active"
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    settings: Dict = Field(default_factory=dict)

# Properties to receive on project creation
class ProjectCreate(ProjectBase):
    organization_id: UUID

# Properties to receive on project update
class ProjectUpdate(ProjectBase):
    pass

# Properties shared by models stored in DB
class ProjectInDBBase(ProjectBase):
    id: UUID
    organization_id: UUID
    created_by: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Properties to return to client
class Project(ProjectInDBBase):
    pass

# Properties stored in DB
class ProjectInDB(ProjectInDBBase):
    pass
