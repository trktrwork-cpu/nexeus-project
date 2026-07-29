from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.session import get_db
from app.lists.service import get_lists_for_board
from app.models.user import User
from app.schemas.list import ListResponse

router = APIRouter(
    prefix="/boards",
    tags=["Lists"],
)


@router.get(
    "/{board_id}/lists",
    response_model=List[ListResponse],
)
def get_board_lists(
    board_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    lists = get_lists_for_board(
        db=db,
        board_id=board_id,
        owner_id=current_user.id,
    )

    if lists is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Board not found",
        )

    return lists