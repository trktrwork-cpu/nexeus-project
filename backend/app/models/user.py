from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.models.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(String(255), unique=True, index=True, nullable=False)

    password_hash = Column(String(255), nullable=False)

    full_name = Column(String(100), nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    boards = relationship(
        "Board",
        back_populates="owner",
        cascade="all, delete-orphan",
    )

    worklogs = relationship(
        "Worklog",
        back_populates="user",
        cascade="all, delete-orphan",
    )