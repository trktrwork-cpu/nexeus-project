from sqlalchemy.orm import Session

from app.models.board import Board
from app.models.list import List


def get_lists_for_board(
    db: Session,
    board_id: int,
    owner_id: int,
) -> list[List] | None:
    board = (
        db.query(Board)
        .filter(
            Board.id == board_id,
            Board.owner_id == owner_id,
        )
        .first()
    )

    if board is None:
        return None

    return (
        db.query(List)
        .filter(List.board_id == board_id)
        .order_by(List.position.asc())
        .all()
    )