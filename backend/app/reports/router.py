from datetime import date, timedelta

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import Response
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.reports.service import (
    export_weekly_report_csv,
    get_weekly_report,
)
from app.schemas.report import WeeklyReportResponse

router = APIRouter(
    prefix="/reports",
    tags=["Reports"],
)


def get_current_week_start() -> date:
    today = date.today()
    return today - timedelta(days=today.weekday())


@router.get(
    "/weekly",
    response_model=WeeklyReportResponse,
)
def get_weekly_report_endpoint(
    week_start: date | None = Query(
        default=None,
        description="Monday of the week to retrieve. Defaults to the current week.",
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if week_start is None:
        week_start = get_current_week_start()

    if week_start.weekday() != 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="week_start must be a Monday.",
        )

    return get_weekly_report(
        db=db,
        owner_id=current_user.id,
        week_start=week_start,
    )


@router.get(
    "/weekly/export",
)
def export_weekly_report_endpoint(
    week_start: date | None = Query(
        default=None,
        description="Monday of the week to export. Defaults to the current week.",
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if week_start is None:
        week_start = get_current_week_start()

    if week_start.weekday() != 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="week_start must be a Monday.",
        )

    csv_content = export_weekly_report_csv(
        db=db,
        owner_id=current_user.id,
        week_start=week_start,
    )

    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={
            "Content-Disposition": (
                f'attachment; filename="weekly-report-{week_start}.csv"'
            )
        },
    )