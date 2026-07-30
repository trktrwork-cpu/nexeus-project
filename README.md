# Nexeus Project

Nexeus is a full-stack Kanban task management application developed using FastAPI, PostgreSQL, React, Vite, and TypeScript. The application allows authenticated users to manage task boards, track worklogs, generate weekly reports, and export report data as CSV files.

---

# Live Demo

## Frontend

https://nexeus-project-1.onrender.com

## Backend API

https://nexeus-project.onrender.com

---

# Features

- User registration and login with JWT authentication
- Protected routes for authenticated users
- Kanban board with workflow columns
- Create, edit, delete, and move task cards
- Drag and drop between columns
- Persistent card ordering
- Worklog management
- Weekly "My Hours" dashboard
- Weekly reports
- Overdue task tracking
- CSV export for weekly reports

---

# Technology Stack

## Backend

- FastAPI
- SQLAlchemy
- PostgreSQL
- Pydantic
- Alembic
- JWT Authentication

## Frontend

- React
- TypeScript
- Vite
- React Router
- Axios

---

# Project Structure

```
.
├── backend/
│   ├── alembic/
│   ├── app/
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── .env
│
├── README.md
└── QA.md
```

---

# Environment Variables

## Backend (.env)

```env
DATABASE_URL=postgresql://username:password@host/database

SECRET_KEY=your_secret_key

ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=60
```

## Frontend (.env)

```env
VITE_API_URL=https://nexeus-project.onrender.com
```

---

# Local Setup

## Backend

Clone the repository.

```bash
git clone <repository-url>
```

Navigate to the backend folder.

```bash
cd backend
```

Create a virtual environment.

```bash
python -m venv .venv
```

Activate it.

Windows

```bash
.venv\Scripts\activate
```

Linux / macOS

```bash
source .venv/bin/activate
```

Install dependencies.

```bash
pip install -r requirements.txt
```

Run database migrations.

```bash
alembic upgrade head
```

Start the backend server.

```bash
uvicorn app.main:app --reload
```

---

## Frontend

Navigate to the frontend folder.

```bash
cd frontend
```

Install dependencies.

```bash
npm install
```

Start the development server.

```bash
npm run dev
```

---

# API Endpoints

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | /auth/register |
| POST | /auth/login |

## Boards

| Method | Endpoint |
|---------|----------|
| GET | /boards |
| POST | /boards |

## Cards

| Method | Endpoint |
|---------|----------|
| GET | /cards |
| POST | /cards |
| PUT | /cards/{id} |
| DELETE | /cards/{id} |
| PATCH | /cards/{id}/move |

## Worklogs

| Method | Endpoint |
|---------|----------|
| GET | /worklogs |
| POST | /worklogs |
| PUT | /worklogs/{id} |
| DELETE | /worklogs/{id} |

## Reports

| Method | Endpoint |
|---------|----------|
| GET | /reports/weekly |
| GET | /reports/weekly/export |

---

# Database

The application uses PostgreSQL.

Database schema changes are managed using Alembic migrations.

Apply the latest migrations using:

```bash
alembic upgrade head
```

---

# Card Ordering Strategy

Cards are ordered within each workflow column using an integer **position** value stored in the PostgreSQL database.

When a card is moved using drag-and-drop, the frontend sends the destination list and the new position to the backend. The backend validates that the authenticated user owns the board, updates the card's list and position, and adjusts the positions of the remaining cards in the affected columns to maintain a consistent ordering.

Because the ordering is persisted in the database, the board displays cards in the same order after refreshing the page or logging in again.

---

# Deployment

The application is deployed using **Render**.

## Frontend

https://nexeus-project-1.onrender.com

## Backend

https://nexeus-project.onrender.com

The frontend communicates with the deployed backend through the `VITE_API_URL` environment variable.

---

# Testing

Manual testing was performed for the following features:

- User registration
- User login
- Protected routes
- Board creation
- Card CRUD operations
- Drag and drop
- Card ordering persistence
- Worklog CRUD operations
- Weekly "My Hours"
- Weekly reports
- Overdue task calculation
- CSV export
- Logout

A detailed testing log is available in:

```
QA.md
```

---

# Future Improvements

Possible future improvements include:

- Card labels
- Search and filtering
- Email notifications
- User avatars
- Team collaboration

---

# Company

This project was developed for **Nexeus**.