from datetime import datetime, timezone

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.auth.service import get_user_by_email
from app.config.settings import settings
from app.database.session import get_db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    print("=" * 60)
    print("TOKEN RECEIVED:", token)

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # Show the payload without validating expiration
        unverified = jwt.get_unverified_claims(token)
        print("UNVERIFIED PAYLOAD:", unverified)

        if "exp" in unverified:
            exp_datetime = datetime.fromtimestamp(
                unverified["exp"],
                tz=timezone.utc,
            )
            print("TOKEN EXPIRES AT (UTC):", exp_datetime)

        print("CURRENT TIME (UTC):", datetime.now(timezone.utc))

        # Now validate the token normally
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )

        print("VERIFIED PAYLOAD:", payload)

        email = payload.get("sub")
        print("EMAIL:", email)

        if email is None:
            print("❌ No email found in token")
            raise credentials_exception

    except JWTError as e:
        print("JWT ERROR:", e)
        raise credentials_exception

    user = get_user_by_email(db, email)

    print("USER FOUND:", user)

    if user is None:
        print("❌ User not found in database")
        raise credentials_exception

    print("✅ Authentication successful")
    print("=" * 60)

    return user