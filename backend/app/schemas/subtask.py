from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class SubtaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    is_completed: bool = False
    order_index: int = 0

class SubtaskCreate(SubtaskBase):
    pass

class SubtaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    is_completed: Optional[bool] = None
    order_index: Optional[int] = None

class SubtaskResponse(SubtaskBase):
    id: int
    task_id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
