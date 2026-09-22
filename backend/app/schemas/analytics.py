from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class PriorityCount(BaseModel):
    priority: str
    count: int

class CategoryCount(BaseModel):
    category: str
    count: int

class RiskCount(BaseModel):
    risk_level: str
    count: int

class DailyActivity(BaseModel):
    date: str
    day: str
    completed: int
    created: int

class AnalyticsSummaryResponse(BaseModel):
    total_tasks: int
    completed_tasks: int
    pending_tasks: int
    in_progress_tasks: int
    high_priority_tasks: int
    at_risk_tasks: int
    completion_rate_percentage: float
    average_completion_hours: Optional[float] = None
    priority_distribution: List[PriorityCount]
    category_distribution: List[CategoryCount]
    risk_distribution: List[RiskCount]

class ProductivityTrendsResponse(BaseModel):
    weekly_history: List[DailyActivity]
    total_subtasks_completed: int
    total_subtasks_count: int
    overall_velocity_tasks_per_day: float
