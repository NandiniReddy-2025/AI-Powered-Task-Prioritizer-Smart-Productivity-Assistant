from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

# --- AI Prioritization Schemas ---

class AIPrioritizeRequest(BaseModel):
    title: str = Field(..., min_length=1)
    description: Optional[str] = None
    deadline: Optional[datetime] = None
    estimated_duration: Optional[float] = Field(1.0, ge=0.1)
    category: Optional[str] = None
    user_importance: Optional[str] = Field(None, pattern="^(High|Medium|Low)$")
    available_time: Optional[float] = Field(None, ge=0.0)

class TransparencyBreakdown(BaseModel):
    model_predicted: Dict[str, Any]
    system_calculated: Dict[str, Any]
    user_provided: Dict[str, Any]

class AIPrioritizeResponse(BaseModel):
    predicted_priority: str
    confidence_score: float
    class_probabilities: Dict[str, float]
    predicted_category: str
    detected_urgency: str
    explanation: str
    breakdown: TransparencyBreakdown

# --- AI Task Breakdown Schemas ---

class AIBreakdownRequest(BaseModel):
    title: str = Field(..., min_length=1)
    description: Optional[str] = None
    category: Optional[str] = None
    target_subtasks: Optional[int] = Field(None, ge=2, le=12)

class SubtaskSuggestion(BaseModel):
    title: str
    estimated_hours: float
    order_index: int
    phase: str

class AIBreakdownResponse(BaseModel):
    main_task: str
    domain: str
    suggested_subtasks: List[SubtaskSuggestion]
    total_estimated_hours: float
    generation_model: str

# --- AI Deadline Risk Schemas ---

class AIDeadlineRiskRequest(BaseModel):
    title: str = Field(..., min_length=1)
    description: Optional[str] = None
    priority: str = Field("Medium", pattern="^(High|Medium|Low)$")
    deadline: Optional[datetime] = None
    estimated_duration: float = Field(1.0, ge=0.1)
    progress: int = Field(0, ge=0, le=100)
    available_time: Optional[float] = None

class AIDeadlineRiskResponse(BaseModel):
    risk_level: str
    risk_score: float
    risk_reason: str
    risk_factors: Dict[str, Any]
    suggested_action: str
    time_remaining_hours: Optional[float] = None
