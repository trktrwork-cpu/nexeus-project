from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.boards.service import create_board, get_board, get_boards
from app.database.session import get_db
from app.models.user import User
from app.schemas.board import BoardCreate, BoardResponse

router = APIRouter(
    prefix="/boards",
    tags=["Boards"],
)


@router.post(
    "/",
    response_model=BoardResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_board(
    board: BoardCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_board(
        db=db,
        board_data=board,
        owner_id=current_user.id,
    )


@router.get(
    "/",
    response_model=List[BoardResponse],
)
def get_user_boards(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_boards(
        db=db,
        owner_id=current_user.id,
    )


@router.get(
    "/{board_id}",
    response_model=BoardResponse,
)
def get_single_board(
    board_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    board = get_board(
        db=db,
        board_id=board_id,
        owner_id=current_user.id,
    )

    if board is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Board not found",
        )

    return board