from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.task import Task
from app.models.subtask import Subtask
from app.schemas.task import TaskCreate, TaskUpdate
from app.schemas.subtask import SubtaskCreate, SubtaskUpdate

def recalculate_task_progress_and_risk(db: Session, task: Task) -> None:
    subtasks = db.query(Subtask).filter(Subtask.task_id == task.id).all()
    if subtasks:
        total = len(subtasks)
        completed = sum(1 for s in subtasks if s.is_completed)
        task.progress = int((completed / total) * 100)
        if task.progress == 100:
            task.completion_status = "Completed"
            if not task.completed_at:
                task.completed_at = datetime.now(timezone.utc)
        elif task.progress > 0:
            task.completion_status = "In Progress"
            task.completed_at = None
        else:
            task.completion_status = "Pending"
            task.completed_at = None
    
    # Recalculate deadline risk
    if task.completion_status == "Completed":
        task.risk_level = "Low"
        task.risk_reason = "Task is already completed."
        task.suggested_action = "No action required."
        return

    if task.deadline:
        now = datetime.now(timezone.utc)
        # Handle offset-naive or offset-aware deadline
        deadline = task.deadline if task.deadline.tzinfo else task.deadline.replace(tzinfo=timezone.utc)
        hours_remaining = (deadline - now).total_seconds() / 3600.0
        remaining_effort = task.estimated_duration * (1.0 - (task.progress / 100.0))

        if hours_remaining <= 0:
            task.risk_level = "High"
            task.risk_reason = f"Deadline passed {abs(hours_remaining):.1f}h ago with {100 - task.progress}% work remaining."
            task.suggested_action = "Expedite remaining items immediately or negotiate an extended deadline."
        elif hours_remaining < (remaining_effort * 1.2):
            task.risk_level = "High"
            task.risk_reason = f"Only {hours_remaining:.1f}h remain for {remaining_effort:.1f}h of work (critical buffer deficit)."
            task.suggested_action = "Divide remaining work into subtasks and prioritize critical deliverables."
        elif hours_remaining < (remaining_effort * 2.5):
            task.risk_level = "Medium"
            task.risk_reason = f"Moderate buffer: {hours_remaining:.1f}h available for {remaining_effort:.1f}h of estimated work."
            task.suggested_action = "Block out focused work sessions in your calendar today to avoid last-minute rush."
        else:
            task.risk_level = "Low"
            task.risk_reason = f"Healthy timeline: {hours_remaining:.1f}h remaining for {remaining_effort:.1f}h of effort."
            task.suggested_action = "On track. Maintain current pace and update subtask progress regularly."
    else:
        if task.priority == "High" and task.progress == 0:
            task.risk_level = "Medium"
            task.risk_reason = "High priority task with no deadline specified and 0% progress."
            task.suggested_action = "Set a target deadline and break the task into initial subtasks."
        else:
            task.risk_level = "Low"
            task.risk_reason = "No immediate deadline constraints detected."
            task.suggested_action = "Set a target completion date to enable proactive risk tracking."

class TaskService:
    @staticmethod
    def create_task(db: Session, user_id: int, task_in: TaskCreate) -> Task:
        task = Task(
            user_id=user_id,
            title=task_in.title.strip(),
            description=task_in.description.strip() if task_in.description else None,
            category=task_in.category or "General",
            priority=task_in.priority or "Medium",
            deadline=task_in.deadline,
            estimated_duration=task_in.estimated_duration or 1.0,
            available_time=task_in.available_time,
            user_importance=task_in.user_importance,
            completion_status="Pending",
            progress=0,
            risk_level="Low"
        )
        db.add(task)
        db.commit()
        db.refresh(task)

        # Add initial subtasks if supplied
        if task_in.subtasks:
            for idx, sub_title in enumerate(task_in.subtasks):
                if sub_title.strip():
                    subtask = Subtask(
                        task_id=task.id,
                        user_id=user_id,
                        title=sub_title.strip(),
                        is_completed=False,
                        order_index=idx
                    )
                    db.add(subtask)
            db.commit()
            db.refresh(task)

        recalculate_task_progress_and_risk(db, task)
        db.commit()
        db.refresh(task)
        return task

    @staticmethod
    def get_tasks(
        db: Session,
        user_id: int,
        category: Optional[str] = None,
        priority: Optional[str] = None,
        status_filter: Optional[str] = None,
        risk_level: Optional[str] = None,
        search: Optional[str] = None
    ) -> List[Task]:
        query = db.query(Task).filter(Task.user_id == user_id)
        if category and category != "All":
            query = query.filter(Task.category == category)
        if priority and priority != "All":
            query = query.filter(Task.priority == priority)
        if status_filter and status_filter != "All":
            query = query.filter(Task.completion_status == status_filter)
        if risk_level and risk_level != "All":
            query = query.filter(Task.risk_level == risk_level)
        if search:
            query = query.filter(Task.title.ilike(f"%{search}%") | Task.description.ilike(f"%{search}%"))
        
        # Sort priority order: High, Medium, Low, then by deadline
        return query.order_by(Task.deadline.asc().nullslast(), Task.created_at.desc()).all()

    @staticmethod
    def get_task_by_id(db: Session, user_id: int, task_id: int) -> Task:
        task = db.query(Task).filter(Task.id == task_id, Task.user_id == user_id).first()
        if not task:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found.")
        return task

    @staticmethod
    def update_task(db: Session, user_id: int, task_id: int, task_in: TaskUpdate) -> Task:
        task = TaskService.get_task_by_id(db, user_id, task_id)
        update_data = task_in.model_dump(exclude_unset=True)
        
        for field, value in update_data.items():
            setattr(task, field, value)
        
        if "completion_status" in update_data:
            if task.completion_status == "Completed":
                task.progress = 100
                task.completed_at = datetime.now(timezone.utc)
                # Mark all subtasks as completed
                for sub in task.subtasks:
                    sub.is_completed = True
            elif task.completion_status == "Pending":
                task.progress = 0
                task.completed_at = None
                for sub in task.subtasks:
                    sub.is_completed = False

        recalculate_task_progress_and_risk(db, task)
        db.commit()
        db.refresh(task)
        return task

    @staticmethod
    def delete_task(db: Session, user_id: int, task_id: int) -> None:
        task = TaskService.get_task_by_id(db, user_id, task_id)
        db.delete(task)
        db.commit()

    @staticmethod
    def toggle_task_complete(db: Session, user_id: int, task_id: int) -> Task:
        task = TaskService.get_task_by_id(db, user_id, task_id)
        if task.completion_status == "Completed":
            task.completion_status = "Pending"
            task.progress = 0
            task.completed_at = None
            for sub in task.subtasks:
                sub.is_completed = False
        else:
            task.completion_status = "Completed"
            task.progress = 100
            task.completed_at = datetime.now(timezone.utc)
            for sub in task.subtasks:
                sub.is_completed = True
        
        recalculate_task_progress_and_risk(db, task)
        db.commit()
        db.refresh(task)
        return task

    # Subtasks
    @staticmethod
    def add_subtask(db: Session, user_id: int, task_id: int, subtask_in: SubtaskCreate) -> Subtask:
        task = TaskService.get_task_by_id(db, user_id, task_id)
        existing_count = db.query(Subtask).filter(Subtask.task_id == task.id).count()
        subtask = Subtask(
            task_id=task.id,
            user_id=user_id,
            title=subtask_in.title.strip(),
            is_completed=subtask_in.is_completed,
            order_index=subtask_in.order_index if subtask_in.order_index else existing_count
        )
        db.add(subtask)
        db.commit()
        db.refresh(subtask)
        
        recalculate_task_progress_and_risk(db, task)
        db.commit()
        db.refresh(subtask)
        return subtask

    @staticmethod
    def update_subtask(db: Session, user_id: int, task_id: int, subtask_id: int, subtask_in: SubtaskUpdate) -> Subtask:
        task = TaskService.get_task_by_id(db, user_id, task_id)
        subtask = db.query(Subtask).filter(Subtask.id == subtask_id, Subtask.task_id == task.id, Subtask.user_id == user_id).first()
        if not subtask:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subtask not found.")
        
        update_data = subtask_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(subtask, field, value)
        
        db.commit()
        recalculate_task_progress_and_risk(db, task)
        db.commit()
        db.refresh(subtask)
        return subtask

    @staticmethod
    def delete_subtask(db: Session, user_id: int, task_id: int, subtask_id: int) -> None:
        task = TaskService.get_task_by_id(db, user_id, task_id)
        subtask = db.query(Subtask).filter(Subtask.id == subtask_id, Subtask.task_id == task.id, Subtask.user_id == user_id).first()
        if not subtask:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subtask not found.")
        
        db.delete(subtask)
        db.commit()
        recalculate_task_progress_and_risk(db, task)
        db.commit()
