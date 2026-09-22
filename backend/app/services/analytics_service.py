from datetime import datetime, timedelta, timezone
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.task import Task
from app.models.subtask import Subtask
from app.schemas.analytics import (
    AnalyticsSummaryResponse, ProductivityTrendsResponse,
    PriorityCount, CategoryCount, RiskCount, DailyActivity
)

class AnalyticsService:
    @staticmethod
    def get_summary(db: Session, user_id: int) -> AnalyticsSummaryResponse:
        tasks = db.query(Task).filter(Task.user_id == user_id).all()
        total_tasks = len(tasks)
        
        if total_tasks == 0:
            return AnalyticsSummaryResponse(
                total_tasks=0,
                completed_tasks=0,
                pending_tasks=0,
                in_progress_tasks=0,
                high_priority_tasks=0,
                at_risk_tasks=0,
                completion_rate_percentage=0.0,
                average_completion_hours=None,
                priority_distribution=[
                    PriorityCount(priority="High", count=0),
                    PriorityCount(priority="Medium", count=0),
                    PriorityCount(priority="Low", count=0)
                ],
                category_distribution=[],
                risk_distribution=[
                    RiskCount(risk_level="High", count=0),
                    RiskCount(risk_level="Medium", count=0),
                    RiskCount(risk_level="Low", count=0)
                ]
            )

        completed_tasks = sum(1 for t in tasks if t.completion_status == "Completed")
        pending_tasks = sum(1 for t in tasks if t.completion_status == "Pending")
        in_progress_tasks = sum(1 for t in tasks if t.completion_status == "In Progress")
        high_priority_tasks = sum(1 for t in tasks if t.priority == "High" and t.completion_status != "Completed")
        at_risk_tasks = sum(1 for t in tasks if t.risk_level in ["High", "Medium"] and t.completion_status != "Completed")
        
        completion_rate = (completed_tasks / total_tasks * 100.0) if total_tasks > 0 else 0.0

        # Average completion hours
        completed_with_times = [
            (t.completed_at - t.created_at).total_seconds() / 3600.0
            for t in tasks
            if t.completion_status == "Completed" and t.completed_at and t.created_at
        ]
        avg_completion_hours = (
            sum(completed_with_times) / len(completed_with_times)
            if completed_with_times else None
        )

        # Priority breakdown
        priority_map = {"High": 0, "Medium": 0, "Low": 0}
        for t in tasks:
            if t.priority in priority_map:
                priority_map[t.priority] += 1
            else:
                priority_map["Medium"] += 1
        priority_dist = [PriorityCount(priority=k, count=v) for k, v in priority_map.items()]

        # Category breakdown
        category_map: Dict[str, int] = {}
        for t in tasks:
            cat = t.category or "General"
            category_map[cat] = category_map.get(cat, 0) + 1
        category_dist = [CategoryCount(category=k, count=v) for k, v in category_map.items()]

        # Risk breakdown
        risk_map = {"High": 0, "Medium": 0, "Low": 0}
        for t in tasks:
            if t.risk_level in risk_map:
                risk_map[t.risk_level] += 1
            else:
                risk_map["Low"] += 1
        risk_dist = [RiskCount(risk_level=k, count=v) for k, v in risk_map.items()]

        return AnalyticsSummaryResponse(
            total_tasks=total_tasks,
            completed_tasks=completed_tasks,
            pending_tasks=pending_tasks,
            in_progress_tasks=in_progress_tasks,
            high_priority_tasks=high_priority_tasks,
            at_risk_tasks=at_risk_tasks,
            completion_rate_percentage=round(completion_rate, 1),
            average_completion_hours=round(avg_completion_hours, 1) if avg_completion_hours else None,
            priority_distribution=priority_dist,
            category_distribution=category_dist,
            risk_distribution=risk_dist
        )

    @staticmethod
    def get_productivity_trends(db: Session, user_id: int) -> ProductivityTrendsResponse:
        tasks = db.query(Task).filter(Task.user_id == user_id).all()
        subtasks = db.query(Subtask).filter(Subtask.user_id == user_id).all()

        total_subtasks = len(subtasks)
        completed_subtasks = sum(1 for s in subtasks if s.is_completed)

        # Last 7 days activity
        now = datetime.now(timezone.utc)
        daily_history: List[DailyActivity] = []
        
        for i in range(6, -1, -1):
            day_target = (now - timedelta(days=i)).date()
            day_name = day_target.strftime("%a")
            date_str = day_target.strftime("%Y-%m-%d")

            completed_count = sum(
                1 for t in tasks
                if t.completion_status == "Completed" and t.completed_at and t.completed_at.date() == day_target
            )
            created_count = sum(
                1 for t in tasks
                if t.created_at and t.created_at.date() == day_target
            )

            daily_history.append(DailyActivity(
                date=date_str,
                day=day_name,
                completed=completed_count,
                created=created_count
            ))

        completed_last_7 = sum(d.completed for d in daily_history)
        velocity = completed_last_7 / 7.0

        return ProductivityTrendsResponse(
            weekly_history=daily_history,
            total_subtasks_completed=completed_subtasks,
            total_subtasks_count=total_subtasks,
            overall_velocity_tasks_per_day=round(velocity, 2)
        )
