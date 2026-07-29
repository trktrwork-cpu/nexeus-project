from sqlalchemy import Column, ForeignKey, Integer, String, Table
from sqlalchemy.orm import relationship

from app.models.base import Base


card_labels = Table(
    "card_labels",
    Base.metadata,
    Column(
        "card_id",
        ForeignKey("cards.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "label_id",
        ForeignKey("labels.id", ondelete="CASCADE"),
        primary_key=True,
    ),
)


class Label(Base):
    __tablename__ = "labels"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(50), nullable=False)

    color = Column(String(20), nullable=False)

    board_id = Column(
        Integer,
        ForeignKey("boards.id", ondelete="CASCADE"),
        nullable=False,
    )

    board = relationship(
        "Board",
    )

    cards = relationship(
        "Card",
        secondary=card_labels,
        back_populates="labels",
    )