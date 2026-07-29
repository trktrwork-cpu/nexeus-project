from sqlalchemy.orm import Session

from app.models.card import Card
from app.models.label import Label


def create_label(
    db: Session,
    board_id: int,
    name: str,
    color: str,
):
    label = Label(
        board_id=board_id,
        name=name,
        color=color,
    )

    db.add(label)
    db.commit()
    db.refresh(label)

    return label


def get_board_labels(
    db: Session,
    board_id: int,
):
    return (
        db.query(Label)
        .filter(Label.board_id == board_id)
        .order_by(Label.name.asc())
        .all()
    )


def get_label(
    db: Session,
    label_id: int,
):
    return (
        db.query(Label)
        .filter(Label.id == label_id)
        .first()
    )


def add_label_to_card(
    db: Session,
    card: Card,
    label: Label,
):
    if label not in card.labels:
        card.labels.append(label)
        db.commit()

    db.refresh(card)

    # Force reload of the relationship
    _ = card.labels

    return card


def remove_label_from_card(
    db: Session,
    card: Card,
    label: Label,
):
    if label in card.labels:
        card.labels.remove(label)
        db.commit()

    db.refresh(card)

    # Force reload of the relationship
    _ = card.labels

    return card


def update_label(
    db: Session,
    label: Label,
    name: str,
    color: str,
):
    label.name = name
    label.color = color

    db.commit()
    db.refresh(label)

    return label


def delete_label(
    db: Session,
    label: Label,
):
    db.delete(label)
    db.commit()


def update_label(
    db: Session,
    label: Label,
    name: str | None = None,
    color: str | None = None,
):
    if name is not None:
        label.name = name

    if color is not None:
        label.color = color

    db.commit()
    db.refresh(label)

    return label


def delete_label(
    db: Session,
    label: Label,
):
    db.delete(label)
    db.commit()