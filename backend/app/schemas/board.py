from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class BoardBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(default=None, max_length=500)


class BoardCreate(BoardBase):
    pass


class BoardUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=100)
    description: Optional[str] = Field(default=None, max_length=500)


class BoardResponse(BoardBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)