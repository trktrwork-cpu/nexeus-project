from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.cards.service import (
    create_card,
    delete_card,
    get_card,
    get_cards_for_list,
    move_card,
    search_cards,
    update_card,
)
from app.database.session import get_db
from app.models.user import User
from app.schemas.card import (
    CardCreate,
    CardMove,
    CardResponse,
    CardUpdate,
)

router = APIRouter(
    tags=["Cards"],
)


@router.post(
    "/lists/{list_id}/cards",
    response_model=CardResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_card(
    list_id: int,
    card: CardCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    created_card = create_card(
        db=db,
        list_id=list_id,
        owner_id=current_user.id,
        title=card.title,
        description=card.description,
        due_date=card.due_date,
    )

    if created_card is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="List not found",
        )

    return created_card


@router.get(
    "/lists/{list_id}/cards",
    response_model=List[CardResponse],
)
def get_list_cards(
    list_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cards = get_cards_for_list(
        db=db,
        list_id=list_id,
        owner_id=current_user.id,
    )

    if cards is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="List not found",
        )

    return cards


@router.get(
    "/cards/search",
    response_model=List[CardResponse],
)
def search_all_cards(
    q: str = Query(..., min_length=1),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return search_cards(
        db=db,
        query=q,
        owner_id=current_user.id,
    )


@router.patch(
    "/cards/{card_id}",
    response_model=CardResponse,
)
def update_existing_card(
    card_id: int,
    card_data: CardUpdate,
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

    return update_card(
        db=db,
        card=card,
        title=card_data.title,
        description=card_data.description,
        due_date=card_data.due_date,
    )


@router.patch(
    "/cards/{card_id}/move",
    response_model=CardResponse,
)
def move_existing_card(
    card_id: int,
    move_data: CardMove,
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

    return move_card(
        db=db,
        card=card,
        new_list_id=move_data.list_id,
        new_position=move_data.position,
    )


@router.delete(
    "/cards/{card_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_existing_card(
    card_id: int,
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

    delete_card(
        db=db,
        card=card,
    )

    return None