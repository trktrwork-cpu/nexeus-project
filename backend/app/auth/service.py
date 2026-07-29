from sqlalchemy.orm import Session

from app.auth.security import hash_password, verify_password
from app.models.user import User
from app.schemas.auth import UserRegister


def get_user_by_email(db: Session, email: str) -> User | None:
    """Return a user by email."""
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, user_data: UserRegister) -> User:
    """Create a new user."""
    user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        password_hash=hash_password(user_data.password),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def authenticate_user(
    db: Session,
    email: str,
    password: str,
) -> User | None:
    """Authenticate a user with email and password."""
    user = get_user_by_email(db, email)

    if not user:
        return None

    if not verify_password(password, user.password_hash):
        return None

    return user