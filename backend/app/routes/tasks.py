from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from app.schemas.subtask import SubtaskCreate, SubtaskUpdate, SubtaskResponse
from app.services.task_service import TaskService
from app.core.deps import get_current_user

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    task_in: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return TaskService.create_task(db=db, user_id=current_user.id, task_in=task_in)

@router.get("", response_model=List[TaskResponse])
def get_tasks(
    category: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    risk_level: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return TaskService.get_tasks(
        db=db,
        user_id=current_user.id,
        category=category,
        priority=priority,
        status_filter=status_filter,
        risk_level=risk_level,
        search=search
    )

@router.get("/{task_id}", response_model=TaskResponse)
def get_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return TaskService.get_task_by_id(db=db, user_id=current_user.id, task_id=task_id)

@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    task_in: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return TaskService.update_task(db=db, user_id=current_user.id, task_id=task_id, task_in=task_in)

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    TaskService.delete_task(db=db, user_id=current_user.id, task_id=task_id)
    return None

@router.patch("/{task_id}/complete", response_model=TaskResponse)
def toggle_task_complete(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return TaskService.toggle_task_complete(db=db, user_id=current_user.id, task_id=task_id)

# Subtask Endpoints
@router.post("/{task_id}/subtasks", response_model=SubtaskResponse, status_code=status.HTTP_201_CREATED)
def add_subtask(
    task_id: int,
    subtask_in: SubtaskCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return TaskService.add_subtask(db=db, user_id=current_user.id, task_id=task_id, subtask_in=subtask_in)

@router.patch("/{task_id}/subtasks/{subtask_id}", response_model=SubtaskResponse)
def update_subtask(
    task_id: int,
    subtask_id: int,
    subtask_in: SubtaskUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return TaskService.update_subtask(
        db=db, user_id=current_user.id, task_id=task_id, subtask_id=subtask_id, subtask_in=subtask_in
    )

@router.delete("/{task_id}/subtasks/{subtask_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_subtask(
    task_id: int,
    subtask_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    TaskService.delete_subtask(db=db, user_id=current_user.id, task_id=task_id, subtask_id=subtask_id)
    return None
