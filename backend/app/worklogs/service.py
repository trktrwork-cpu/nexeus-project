from datetime import date, timedelta

from sqlalchemy.orm import Session

from app.models.card import Card
from app.models.worklog import Worklog


def create_worklog(
    db: Session,
    card_id: int,
    user_id: int,
    hours,
    work_date: date,
    notes: str | None = None,
):
    card = (
        db.query(Card)
        .filter(Card.id == card_id)
        .first()
    )

    if card is None:
        return None

    worklog = Worklog(
        card_id=card_id,
        user_id=user_id,
        hours=hours,
        work_date=work_date,
        notes=notes,
    )

    db.add(worklog)
    db.commit()
    db.refresh(worklog)

    return worklog


def get_card_worklogs(
    db: Session,
    card_id: int,
):
    return (
        db.query(Worklog)
        .filter(Worklog.card_id == card_id)
        .order_by(Worklog.work_date.desc())
        .all()
    )


def get_user_weekly_worklogs(
    db: Session,
    user_id: int,
    week_start: date,
):
    week_end = week_start + timedelta(days=6)

    return (
        db.query(Worklog)
        .filter(
            Worklog.user_id == user_id,
            Worklog.work_date >= week_start,
            Worklog.work_date <= week_end,
        )
        .order_by(
            Worklog.work_date.asc(),
            Worklog.id.asc(),
        )
        .all()
    )


def update_worklog(
    db: Session,
    worklog: Worklog,
    hours=None,
    work_date=None,
    notes=None,
):
    if hours is not None:
        worklog.hours = hours

    if work_date is not None:
        worklog.work_date = work_date

    if notes is not None:
        worklog.notes = notes

    db.commit()
    db.refresh(worklog)

    return worklog


def delete_worklog(
    db: Session,
    worklog: Worklog,
):
    db.delete(worklog)
    db.commit()


def get_worklog(
    db: Session,
    worklog_id: int,
):
    return (
        db.query(Worklog)
        .filter(Worklog.id == worklog_id)
        .first()
    )