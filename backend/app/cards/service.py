from datetime import date

from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.board import Board
from app.models.card import Card
from app.models.list import List


def create_card(
    db: Session,
    list_id: int,
    owner_id: int,
    title: str,
    description: str | None = None,
    due_date: date | None = None,
):
    list_obj = (
        db.query(List)
        .join(Board, List.board_id == Board.id)
        .filter(
            List.id == list_id,
            Board.owner_id == owner_id,
        )
        .first()
    )

    if list_obj is None:
        return None

    position = (
        db.query(Card)
        .filter(Card.list_id == list_id)
        .count()
    )

    card = Card(
        title=title,
        description=description,
        due_date=due_date,
        position=position,
        list_id=list_id,
    )

    db.add(card)
    db.commit()
    db.refresh(card)

    return card


def get_card(
    db: Session,
    card_id: int,
    owner_id: int,
):
    return (
        db.query(Card)
        .join(List, Card.list_id == List.id)
        .join(Board, List.board_id == Board.id)
        .filter(
            Card.id == card_id,
            Board.owner_id == owner_id,
        )
        .first()
    )


def get_cards_for_list(
    db: Session,
    list_id: int,
    owner_id: int,
):
    list_obj = (
        db.query(List)
        .join(Board, List.board_id == Board.id)
        .filter(
            List.id == list_id,
            Board.owner_id == owner_id,
        )
        .first()
    )

    if list_obj is None:
        return None

    return (
        db.query(Card)
        .filter(Card.list_id == list_id)
        .order_by(Card.position)
        .all()
    )


def search_cards(
    db: Session,
    query: str,
    owner_id: int,
):
    return (
        db.query(Card)
        .join(List, Card.list_id == List.id)
        .join(Board, List.board_id == Board.id)
        .filter(
            Board.owner_id == owner_id,
            or_(
                Card.title.ilike(f"%{query}%"),
                Card.description.ilike(f"%{query}%"),
            ),
        )
        .order_by(Card.created_at.desc())
        .all()
    )


def update_card(
    db: Session,
    card: Card,
    title: str | None = None,
    description: str | None = None,
    due_date: date | None = None,
):
    if title is not None:
        card.title = title

    if description is not None:
        card.description = description

    if due_date is not None:
        card.due_date = due_date

    db.commit()
    db.refresh(card)

    return card


def delete_card(
    db: Session,
    card: Card,
):
    db.delete(card)
    db.commit()


def move_card(
    db: Session,
    card: Card,
    new_list_id: int,
    new_position: int,
):
    old_list_id = card.list_id
    old_position = card.position

    if old_list_id == new_list_id:

        if new_position > old_position:
            cards = (
                db.query(Card)
                .filter(
                    Card.list_id == old_list_id,
                    Card.position > old_position,
                    Card.position <= new_position,
                )
                .all()
            )

            for c in cards:
                c.position -= 1

        elif new_position < old_position:
            cards = (
                db.query(Card)
                .filter(
                    Card.list_id == old_list_id,
                    Card.position >= new_position,
                    Card.position < old_position,
                )
                .all()
            )

            for c in cards:
                c.position += 1

        card.position = new_position

    else:

        source_cards = (
            db.query(Card)
            .filter(
                Card.list_id == old_list_id,
                Card.position > old_position,
            )
            .all()
        )

        for c in source_cards:
            c.position -= 1

        destination_cards = (
            db.query(Card)
            .filter(
                Card.list_id == new_list_id,
                Card.position >= new_position,
            )
            .all()
        )

        for c in destination_cards:
            c.position += 1

        card.list_id = new_list_id
        card.position = new_position

    db.commit()
    db.refresh(card)

    return card