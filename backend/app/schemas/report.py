from pydantic import BaseModel


class HoursByUser(BaseModel):
    user_id: int
    username: str
    total_hours: float


class HoursByCard(BaseModel):
    card_id: int
    card_title: str
    total_hours: float


class WeeklySummary(BaseModel):
    total_hours: float
    newly_created_tasks: int
    completed_tasks: int
    overdue_tasks: int


class WeeklyReportResponse(BaseModel):
    summary: WeeklySummary
    hours_by_user: list[HoursByUser]
    hours_by_card: list[HoursByCard]