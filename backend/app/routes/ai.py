from fastapi import APIRouter, Depends, HTTPException, status
from app.models.user import User
from app.schemas.ai import (
    AIPrioritizeRequest, AIPrioritizeResponse,
    AIBreakdownRequest, AIBreakdownResponse,
    AIDeadlineRiskRequest, AIDeadlineRiskResponse
)
from app.core.deps import get_current_user
from ml.inference.predictor import TaskPriorityPredictor
from ml.inference.breakdown_engine import TaskBreakdownEngine
from ml.inference.risk_predictor import DeadlineRiskPredictor

router = APIRouter(prefix="/ai", tags=["AI Assistance"])

@router.post("/prioritize", response_model=AIPrioritizeResponse)
def prioritize_task(
    request: AIPrioritizeRequest,
    current_user: User = Depends(get_current_user)
):
    try:
        predictor = TaskPriorityPredictor.get_instance()
        result = predictor.predict(
            title=request.title,
            description=request.description,
            deadline=request.deadline,
            estimated_duration=request.estimated_duration or 1.0,
            category=request.category,
            user_importance=request.user_importance,
            available_time=request.available_time
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI Prioritization failed: {str(e)}"
        )

@router.post("/breakdown", response_model=AIBreakdownResponse)
def breakdown_task(
    request: AIBreakdownRequest,
    current_user: User = Depends(get_current_user)
):
    try:
        result = TaskBreakdownEngine.breakdown(
            title=request.title,
            description=request.description,
            category=request.category,
            target_subtasks=request.target_subtasks
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI Task Breakdown failed: {str(e)}"
        )

@router.post("/deadline-risk", response_model=AIDeadlineRiskResponse)
def evaluate_deadline_risk(
    request: AIDeadlineRiskRequest,
    current_user: User = Depends(get_current_user)
):
    try:
        result = DeadlineRiskPredictor.predict_risk(
            title=request.title,
            description=request.description,
            priority=request.priority,
            deadline=request.deadline,
            estimated_duration=request.estimated_duration,
            progress=request.progress,
            available_time=request.available_time
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Deadline Risk Evaluation failed: {str(e)}"
        )
