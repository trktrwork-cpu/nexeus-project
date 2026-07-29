from sqlalchemy import (
    Column,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.models.base import Base


class Card(Base):
    __tablename__ = "cards"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(255), nullable=False)

    description = Column(Text, nullable=True)

    due_date = Column(
        Date,
        nullable=True,
    )

    position = Column(Integer, nullable=False, default=0)

    list_id = Column(
        Integer,
        ForeignKey("lists.id", ondelete="CASCADE"),
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

    list = relationship(
        "List",
        back_populates="cards",
    )

    worklogs = relationship(
        "Worklog",
        back_populates="card",
        cascade="all, delete-orphan",
    )

    labels = relationship(
        "Label",
        secondary="card_labels",
        back_populates="cards",
    )