from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.models.base import Base


class List(Base):
    __tablename__ = "lists"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(100), nullable=False)

    position = Column(Integer, nullable=False)

    board_id = Column(
        Integer,
        ForeignKey("boards.id", ondelete="CASCADE"),
        nullable=False,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    board = relationship(
        "Board",
        back_populates="lists",
    )

    cards = relationship(
        "Card",
        back_populates="list",
        cascade="all, delete-orphan",
    )