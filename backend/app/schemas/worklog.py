from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field, field_validator


class WorklogCreate(BaseModel):
    hours: Decimal = Field(..., gt=0)
    work_date: date
    notes: Optional[str] = Field(
        default=None,
        max_length=200,
    )

    @field_validator("work_date")
    @classmethod
    def validate_work_date(cls, value: date):
        if value > date.today():
            raise ValueError("Work date cannot be in the future.")
        return value


class WorklogUpdate(BaseModel):
    hours: Optional[Decimal] = Field(
        default=None,
        gt=0,
    )
    work_date: Optional[date] = None
    notes: Optional[str] = Field(
        default=None,
        max_length=200,
    )

    @field_validator("work_date")
    @classmethod
    def validate_work_date(cls, value: Optional[date]):
        if value is not None and value > date.today():
            raise ValueError("Work date cannot be in the future.")
        return value


class WorklogResponse(BaseModel):
    id: int
    card_id: int
    user_id: int
    hours: Decimal
    work_date: date
    notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True