from datetime import date
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.worklog import (
    WorklogCreate,
    WorklogResponse,
    WorklogUpdate,
)
from app.worklogs.service import (
    create_worklog,
    delete_worklog,
    get_card_worklogs,
    get_user_weekly_worklogs,
    get_worklog,
    update_worklog,
)

router = APIRouter(
    tags=["Worklogs"],
)


@router.post(
    "/cards/{card_id}/worklogs",
    response_model=WorklogResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_worklog(
    card_id: int,
    worklog: WorklogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    created_worklog = create_worklog(
        db=db,
        card_id=card_id,
        user_id=current_user.id,
        hours=worklog.hours,
        work_date=worklog.work_date,
        notes=worklog.notes,
    )

    if created_worklog is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Card not found",
        )

    return created_worklog


@router.get(
    "/cards/{card_id}/worklogs",
    response_model=List[WorklogResponse],
)
def get_worklogs_for_card(
    card_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_card_worklogs(
        db=db,
        card_id=card_id,
    )


@router.get(
    "/worklogs/me",
    response_model=List[WorklogResponse],
)
def get_my_weekly_worklogs(
    week_start: date = Query(
        ...,
        description="Monday of the week to retrieve.",
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_weekly_worklogs(
        db=db,
        user_id=current_user.id,
        week_start=week_start,
    )


@router.patch(
    "/worklogs/{worklog_id}",
    response_model=WorklogResponse,
)
def update_existing_worklog(
    worklog_id: int,
    worklog_data: WorklogUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    worklog = get_worklog(
        db=db,
        worklog_id=worklog_id,
    )

    if worklog is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Worklog not found",
        )

    if worklog.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only edit your own worklogs.",
        )

    return update_worklog(
        db=db,
        worklog=worklog,
        hours=worklog_data.hours,
        work_date=worklog_data.work_date,
        notes=worklog_data.notes,
    )


@router.delete(
    "/worklogs/{worklog_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_existing_worklog(
    worklog_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    worklog = get_worklog(
        db=db,
        worklog_id=worklog_id,
    )

    if worklog is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Worklog not found",
        )

    if worklog.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own worklogs.",
        )

    delete_worklog(
        db=db,
        worklog=worklog,
    )

    return None