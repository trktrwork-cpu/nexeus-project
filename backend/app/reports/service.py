from datetime import date, timedelta
from decimal import Decimal
import csv
import io

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.board import Board
from app.models.card import Card
from app.models.list import List
from app.models.user import User
from app.models.worklog import Worklog
from app.schemas.report import (
    HoursByCard,
    HoursByUser,
    WeeklyReportResponse,
    WeeklySummary,
)


def get_weekly_report(
    db: Session,
    owner_id: int,
    week_start: date,
) -> WeeklyReportResponse:
    week_end = week_start + timedelta(days=6)

    return WeeklyReportResponse(
        summary=WeeklySummary(
            total_hours=_get_total_hours(
                db,
                owner_id,
                week_start,
                week_end,
            ),
            newly_created_tasks=_get_newly_created_tasks(
                db,
                owner_id,
                week_start,
                week_end,
            ),
            completed_tasks=_get_completed_tasks(
                db,
                owner_id,
                week_start,
                week_end,
            ),
        ),
        hours_by_user=_get_hours_by_user(
            db,
            owner_id,
            week_start,
            week_end,
        ),
        hours_by_card=_get_hours_by_card(
            db,
            owner_id,
            week_start,
            week_end,
        ),
    )


def export_weekly_report_csv(
    db: Session,
    owner_id: int,
    week_start: date,
) -> str:
    report = get_weekly_report(
        db=db,
        owner_id=owner_id,
        week_start=week_start,
    )

    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow(["Weekly Report"])
    writer.writerow(["Week Start", week_start.isoformat()])
    writer.writerow([])

    writer.writerow(["Summary"])
    writer.writerow(["Total Hours", report.summary.total_hours])
    writer.writerow(
        [
            "New Tasks",
            report.summary.newly_created_tasks,
        ]
    )
    writer.writerow(
        [
            "Completed Tasks",
            report.summary.completed_tasks,
        ]
    )

    writer.writerow([])

    writer.writerow(["Hours by User"])
    writer.writerow(["User", "Hours"])

    for user in report.hours_by_user:
        writer.writerow(
            [
                user.username,
                user.total_hours,
            ]
        )

    writer.writerow([])

    writer.writerow(["Hours by Card"])
    writer.writerow(["Card", "Hours"])

    for card in report.hours_by_card:
        writer.writerow(
            [
                card.card_title,
                card.total_hours,
            ]
        )

    return output.getvalue()


def _base_query(
    db: Session,
    owner_id: int,
    week_start: date,
    week_end: date,
):
    return (
        db.query(Worklog)
        .join(Card, Worklog.card_id == Card.id)
        .join(List, Card.list_id == List.id)
        .join(Board, List.board_id == Board.id)
        .filter(
            Board.owner_id == owner_id,
            Worklog.work_date >= week_start,
            Worklog.work_date <= week_end,
        )
    )


def _get_total_hours(
    db: Session,
    owner_id: int,
    week_start: date,
    week_end: date,
) -> float:
    total = (
        _base_query(
            db,
            owner_id,
            week_start,
            week_end,
        )
        .with_entities(
            func.sum(Worklog.hours),
        )
        .scalar()
    )

    return float(total or Decimal("0"))


def _get_hours_by_user(
    db: Session,
    owner_id: int,
    week_start: date,
    week_end: date,
) -> list[HoursByUser]:
    rows = (
        _base_query(
            db,
            owner_id,
            week_start,
            week_end,
        )
        .join(User, Worklog.user_id == User.id)
        .with_entities(
            User.id,
            User.full_name,
            func.sum(Worklog.hours),
        )
        .group_by(
            User.id,
            User.full_name,
        )
        .order_by(
            func.sum(Worklog.hours).desc(),
        )
        .all()
    )

    return [
        HoursByUser(
            user_id=row[0],
            username=row[1],
            total_hours=float(row[2]),
        )
        for row in rows
    ]


def _get_hours_by_card(
    db: Session,
    owner_id: int,
    week_start: date,
    week_end: date,
) -> list[HoursByCard]:
    rows = (
        _base_query(
            db,
            owner_id,
            week_start,
            week_end,
        )
        .with_entities(
            Card.id,
            Card.title,
            func.sum(Worklog.hours),
        )
        .group_by(
            Card.id,
            Card.title,
        )
        .order_by(
            func.sum(Worklog.hours).desc(),
        )
        .all()
    )

    return [
        HoursByCard(
            card_id=row[0],
            card_title=row[1],
            total_hours=float(row[2]),
        )
        for row in rows
    ]


def _get_newly_created_tasks(
    db: Session,
    owner_id: int,
    week_start: date,
    week_end: date,
) -> int:
    return (
        db.query(Card)
        .join(List, Card.list_id == List.id)
        .join(Board, List.board_id == Board.id)
        .filter(
            Board.owner_id == owner_id,
            func.date(Card.created_at) >= week_start,
            func.date(Card.created_at) <= week_end,
        )
        .count()
    )


def _get_completed_tasks(
    db: Session,
    owner_id: int,
    week_start: date,
    week_end: date,
) -> int:
    return (
        db.query(Card)
        .join(List, Card.list_id == List.id)
        .join(Board, List.board_id == Board.id)
        .filter(
            Board.owner_id == owner_id,
            func.date(Card.updated_at) >= week_start,
            func.date(Card.updated_at) <= week_end,
        )
        .count()
    )