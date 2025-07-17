from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
from app.core.config import settings

router = APIRouter()

@router.get("/", response_model=List[schemas.Project])
def list_projects(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    organization_id: Optional[UUID] = None,
    current_user: models.User = Depends(deps.get_current_user),
):
    """
    List all projects. Can be filtered by organization_id.
    """
    projects = crud.project.get_multi_by_organization(
        db=db, 
        organization_id=organization_id,
        skip=skip,
        limit=limit
    )
    return projects

@router.post("/", response_model=schemas.Project)
def create_project(
    *,
    db: Session = Depends(deps.get_db),
    project_in: schemas.ProjectCreate,
    current_user: models.User = Depends(deps.get_current_user),
):
    """
    Create new project.
    """
    project = crud.project.create_with_owner(
        db=db,
        obj_in=project_in,
        owner_id=current_user.id
    )
    return project

@router.get("/{project_id}", response_model=schemas.Project)
def get_project(
    *,
    db: Session = Depends(deps.get_db),
    project_id: UUID,
    current_user: models.User = Depends(deps.get_current_user),
):
    """
    Get project by ID.
    """
    project = crud.project.get(db=db, id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.put("/{project_id}", response_model=schemas.Project)
def update_project(
    *,
    db: Session = Depends(deps.get_db),
    project_id: UUID,
    project_in: schemas.ProjectUpdate,
    current_user: models.User = Depends(deps.get_current_user),
):
    """
    Update project.
    """
    project = crud.project.get(db=db, id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    project = crud.project.update(db=db, db_obj=project, obj_in=project_in)
    return project

@router.delete("/{project_id}", response_model=schemas.Project)
def delete_project(
    *,
    db: Session = Depends(deps.get_db),
    project_id: UUID,
    current_user: models.User = Depends(deps.get_current_user),
):
    """
    Delete project.
    """
    project = crud.project.get(db=db, id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    project = crud.project.remove(db=db, id=project_id)
    return project
