from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.schemas.label import LabelResponse


class CardBase(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[date] = None


class CardCreate(CardBase):
    pass


class CardUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[date] = None


class CardMove(BaseModel):
    list_id: int
    position: int


class CardResponse(CardBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    position: int
    list_id: int
    created_at: datetime
    updated_at: datetime
    labels: list[LabelResponse] = []