from sqlalchemy import Column, Date, DateTime, ForeignKey, Integer, Numeric, String, func
from sqlalchemy.orm import relationship

from app.models.base import Base


class Worklog(Base):
    __tablename__ = "worklogs"

    id = Column(Integer, primary_key=True, index=True)

    card_id = Column(
        Integer,
        ForeignKey("cards.id", ondelete="CASCADE"),
        nullable=False,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    hours = Column(
        Numeric(5, 2),
        nullable=False,
    )

    work_date = Column(
        Date,
        nullable=False,
    )

    notes = Column(
        String(200),
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    card = relationship(
        "Card",
        back_populates="worklogs",
    )

    user = relationship(
        "User",
        back_populates="worklogs",
    )