# 📊 Analytics and Reports API Endpoints
# Endpoints for generating reports, analytics, and insights

from datetime import datetime, timedelta
from typing import Any, Optional

from app.api.deps import get_current_active_user, get_db
from app.db.models.user import User
from app.services.assessment_service import AssessmentService
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/dashboard")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get dashboard statistics for the current user.
    """
    assessment_service = AssessmentService(db)

    # Get basic stats
    total_assessments = assessment_service.get_count_by_user(current_user.id)
    completed_assessments = assessment_service.get_completed_count_by_user(
        current_user.id
    )
    in_progress_assessments = assessment_service.get_in_progress_count_by_user(
        current_user.id
    )

    # Calculate average score
    avg_score = assessment_service.get_average_score_by_user(current_user.id)

    # Get recent assessments
    recent_assessments = assessment_service.get_recent_by_user(
        user_id=current_user.id, limit=5
    )

    return {
        "total_assessments": total_assessments,
        "completed_assessments": completed_assessments,
        "in_progress_assessments": in_progress_assessments,
        "average_score": round(avg_score, 1) if avg_score else 0,
        "recent_assessments": recent_assessments,
        "completion_rate": round((completed_assessments / total_assessments * 100), 1)
        if total_assessments > 0
        else 0,
    }


@router.get("/progress")
def get_progress_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    days: int = Query(default=90, description="Number of days to look back"),
) -> Any:
    """
    Get progress report showing improvement over time.
    """
    assessment_service = AssessmentService(db)

    # Get assessments from the last N days
    start_date = datetime.utcnow() - timedelta(days=days)
    assessments = assessment_service.get_by_user_and_date_range(
        user_id=current_user.id, start_date=start_date, end_date=datetime.utcnow()
    )

    # Calculate monthly progress
    monthly_progress = assessment_service.calculate_monthly_progress(assessments)

    # Category-wise performance
    category_performance = assessment_service.calculate_category_performance(
        user_id=current_user.id, days=days
    )

    return {
        "period_days": days,
        "total_assessments": len(assessments),
        "monthly_progress": monthly_progress,
        "category_performance": category_performance,
        "improvement_trend": assessment_service.calculate_improvement_trend(
            assessments
        ),
    }


@router.get("/performance")
def get_performance_analysis(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    category: Optional[str] = Query(
        default=None, description="Filter by specific category"
    ),
) -> Any:
    """
    Get detailed performance analysis.
    """
    assessment_service = AssessmentService(db)

    # Get performance breakdown by categories
    performance_data = assessment_service.get_performance_breakdown(
        user_id=current_user.id, category_filter=category
    )

    # Get strengths and areas for improvement
    strengths = assessment_service.get_user_strengths(current_user.id)
    improvement_areas = assessment_service.get_improvement_areas(current_user.id)

    # Get peer comparison (anonymized)
    peer_comparison = assessment_service.get_peer_comparison(current_user.id)

    return {
        "performance_breakdown": performance_data,
        "strengths": strengths,
        "improvement_areas": improvement_areas,
        "peer_comparison": peer_comparison,
        "recommendations": assessment_service.get_development_recommendations(
            current_user.id
        ),
    }


@router.get("/export")
def export_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    format: str = Query(default="json", description="Export format: json, csv, pdf"),
    date_from: Optional[datetime] = Query(default=None),
    date_to: Optional[datetime] = Query(default=None),
) -> Any:
    """
    Export comprehensive report in specified format.
    """
    assessment_service = AssessmentService(db)

    # Get all assessments for the user within date range
    assessments = assessment_service.get_by_user_and_date_range(
        user_id=current_user.id,
        start_date=date_from,
        end_date=date_to or datetime.utcnow(),
    )

    if format.lower() == "csv":
        # Generate CSV export
        csv_data = assessment_service.export_to_csv(assessments)
        return {"data": csv_data, "format": "csv"}

    elif format.lower() == "pdf":
        # Generate PDF report (would typically return a file or URL)
        pdf_url = assessment_service.generate_pdf_report(current_user.id, assessments)
        return {"download_url": pdf_url, "format": "pdf"}

    else:
        # Default JSON export
        return {
            "user_info": {
                "name": current_user.full_name,
                "email": current_user.email,
                "export_date": datetime.utcnow().isoformat(),
            },
            "assessments": assessments,
            "summary": assessment_service.get_summary_stats(assessments),
            "format": "json",
        }


@router.get("/admin/overview")
def get_admin_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get administrative overview (requires admin privileges).
    """
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions"
        )

    assessment_service = AssessmentService(db)

    # System-wide statistics
    total_users = assessment_service.get_total_users()
    total_assessments = assessment_service.get_total_assessments()
    active_users = assessment_service.get_active_users_count()

    # Performance metrics
    average_completion_rate = assessment_service.get_system_completion_rate()
    average_scores = assessment_service.get_system_average_scores()

    # Recent activity
    recent_activity = assessment_service.get_recent_system_activity()

    return {
        "system_stats": {
            "total_users": total_users,
            "total_assessments": total_assessments,
            "active_users": active_users,
            "completion_rate": average_completion_rate,
        },
        "performance_metrics": average_scores,
        "recent_activity": recent_activity,
        "trends": assessment_service.get_system_trends(),
    }
