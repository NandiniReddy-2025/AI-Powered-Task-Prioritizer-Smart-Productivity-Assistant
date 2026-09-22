from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User
from app.schemas.analytics import AnalyticsSummaryResponse, ProductivityTrendsResponse
from app.services.analytics_service import AnalyticsService
from app.core.deps import get_current_user

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/summary", response_model=AnalyticsSummaryResponse)
def get_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return AnalyticsService.get_summary(db=db, user_id=current_user.id)

@router.get("/productivity", response_model=ProductivityTrendsResponse)
def get_productivity(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return AnalyticsService.get_productivity_trends(db=db, user_id=current_user.id)
