from pydantic import BaseModel, ConfigDict


class LabelBase(BaseModel):
    name: str
    color: str


class LabelCreate(LabelBase):
    board_id: int


class LabelUpdate(BaseModel):
    name: str
    color: str


class LabelResponse(LabelBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    board_id: int
    