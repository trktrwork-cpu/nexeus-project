from sqlalchemy.orm import Session

from app.models.board import Board
from app.models.list import List
from app.schemas.board import BoardCreate


DEFAULT_LISTS = [
    "Backlog",
    "In Progress",
    "Review",
    "Done",
]


def create_board(
    db: Session,
    board_data: BoardCreate,
    owner_id: int,
) -> Board:
    board = Board(
        title=board_data.title,
        description=board_data.description,
        owner_id=owner_id,
    )

    db.add(board)
    db.flush()

    for position, title in enumerate(DEFAULT_LISTS):
        board_list = List(
            title=title,
            position=position,
            board_id=board.id,
        )
        db.add(board_list)

    db.commit()
    db.refresh(board)

    return board


def get_boards(
    db: Session,
    owner_id: int,
) -> list[Board]:
    return (
        db.query(Board)
        .filter(Board.owner_id == owner_id)
        .order_by(Board.created_at.asc())
        .all()
    )


def get_board(
    db: Session,
    board_id: int,
    owner_id: int,
) -> Board | None:
    return (
        db.query(Board)
        .filter(
            Board.id == board_id,
            Board.owner_id == owner_id,
        )
        .first()
    )