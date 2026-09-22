from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field
from app.schemas.subtask import SubtaskResponse

class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    category: str = Field("General", max_length=100)
    priority: str = Field("Medium", pattern="^(High|Medium|Low)$")
    deadline: Optional[datetime] = None
    estimated_duration: float = Field(1.0, ge=0.1, le=1000.0)
    available_time: Optional[float] = Field(None, ge=0.0)
    user_importance: Optional[str] = Field(None, pattern="^(High|Medium|Low)$")

class TaskCreate(TaskBase):
    auto_prioritize: bool = False
    subtasks: Optional[List[str]] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[str] = Field(None, pattern="^(High|Medium|Low)$")
    deadline: Optional[datetime] = None
    estimated_duration: Optional[float] = Field(None, ge=0.1)
    available_time: Optional[float] = None
    user_importance: Optional[str] = Field(None, pattern="^(High|Medium|Low)$")
    completion_status: Optional[str] = Field(None, pattern="^(Pending|In Progress|Completed)$")
    progress: Optional[int] = Field(None, ge=0, le=100)
    risk_level: Optional[str] = Field(None, pattern="^(Low|Medium|High)$")
    risk_reason: Optional[str] = None
    suggested_action: Optional[str] = None

class TaskResponse(TaskBase):
    id: int
    user_id: int
    completion_status: str
    progress: int
    risk_level: str
    predicted_priority: Optional[str] = None
    confidence_score: Optional[float] = None
    priority_explanation: Optional[str] = None
    risk_reason: Optional[str] = None
    suggested_action: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None
    subtasks: List[SubtaskResponse] = []

    class Config:
        from_attributes = True
