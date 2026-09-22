from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.session import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), default="General", nullable=False)
    
    # Priority & Explanations
    priority = Column(String(20), default="Medium", nullable=False)  # High, Medium, Low
    predicted_priority = Column(String(20), nullable=True)           # Model output
    confidence_score = Column(Float, nullable=True)                 # Model confidence 0.0 - 1.0
    priority_explanation = Column(Text, nullable=True)             # Explainable reasoning
    
    # Temporal & Effort Attributes
    deadline = Column(DateTime, nullable=True)
    estimated_duration = Column(Float, default=1.0, nullable=False) # In hours
    available_time = Column(Float, nullable=True)                   # User available time in hours
    user_importance = Column(String(20), nullable=True)             # User-selected importance
    
    # Status, Progress & Risk
    completion_status = Column(String(30), default="Pending", nullable=False) # Pending, In Progress, Completed
    progress = Column(Integer, default=0, nullable=False)           # 0 to 100%
    risk_level = Column(String(20), default="Low", nullable=False)  # Low, Medium, High
    risk_reason = Column(Text, nullable=True)
    suggested_action = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
    completed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="tasks")
    subtasks = relationship("Subtask", back_populates="task", cascade="all, delete-orphan", order_by="Subtask.order_index")
