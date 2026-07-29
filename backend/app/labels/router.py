from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.cards.service import get_card
from app.database.session import get_db
from app.models.user import User
from app.schemas.card import CardResponse
from app.schemas.label import (
    LabelCreate,
    LabelResponse,
    LabelUpdate,
)
from app.labels.service import (
    add_label_to_card,
    create_label,
    delete_label,
    get_board_labels,
    get_label,
    remove_label_from_card,
    update_label,
)

router = APIRouter(
    tags=["Labels"],
)


@router.post(
    "/labels",
    response_model=LabelResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_label(
    label: LabelCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_label(
        db=db,
        board_id=label.board_id,
        name=label.name,
        color=label.color,
    )


@router.get(
    "/boards/{board_id}/labels",
    response_model=List[LabelResponse],
)
def get_labels(
    board_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_board_labels(
        db=db,
        board_id=board_id,
    )


@router.patch(
    "/labels/{label_id}",
    response_model=LabelResponse,
)
def edit_label(
    label_id: int,
    label_update: LabelUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    label = get_label(db, label_id)

    if label is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Label not found",
        )

    return update_label(
        db=db,
        label=label,
        name=label_update.name,
        color=label_update.color,
    )


@router.delete(
    "/labels/{label_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_existing_label(
    label_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    label = get_label(db, label_id)

    if label is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Label not found",
        )

    delete_label(
        db=db,
        label=label,
    )

    return None


@router.post(
    "/cards/{card_id}/labels/{label_id}",
    response_model=CardResponse,
)
def attach_label(
    card_id: int,
    label_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    card = get_card(
        db=db,
        card_id=card_id,
        owner_id=current_user.id,
    )

    if card is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Card not found",
        )

    label = get_label(db, label_id)

    if label is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Label not found",
        )

    return add_label_to_card(
        db=db,
        card=card,
        label=label,
    )


@router.delete(
    "/cards/{card_id}/labels/{label_id}",
    response_model=CardResponse,
)
def detach_label(
    card_id: int,
    label_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    card = get_card(
        db=db,
        card_id=card_id,
        owner_id=current_user.id,
    )

    if card is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Card not found",
        )

    label = get_label(db, label_id)

    if label is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Label not found",
        )

    return remove_label_from_card(
        db=db,
        card=card,
        label=label,
    )