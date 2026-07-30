from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import app.models
from app.auth.router import router as auth_router
from app.boards.router import router as boards_router
from app.cards.router import router as cards_router
from app.config.settings import settings
from app.database.database import Base, engine
from app.labels.router import router as labels_router
from app.lists.router import router as lists_router
from app.reports.router import router as reports_router
from app.worklogs.router import router as worklogs_router

app = FastAPI(
    title="NeoCare Health API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication
app.include_router(auth_router)

# Boards
app.include_router(boards_router)

# Lists
app.include_router(lists_router)

# Cards
app.include_router(cards_router)

# Labels
app.include_router(labels_router)

# Worklogs
app.include_router(worklogs_router)

# Reports
app.include_router(reports_router)


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

    with engine.connect() as connection:
        print("✅ Connected to PostgreSQL successfully!")


@app.get("/")
def root():
    return {
        "message": "NeoCare Health API is running!",
        "algorithm": settings.ALGORITHM,
    }