# Library Management System (LMS)

A full-stack Library Management System with Django REST API backend, PostgreSQL, Redis, Celery background jobs, and an Nginx-served frontend.

## Project Structure

- `backend/` — Django + DRF API, JWT auth, business logic, notifications, Celery tasks
- `frontend/` — Single-page admin UI (`index.html`) served by Nginx
- `docker-compose.yml` — root-level orchestration for all services

## Features

- Admin/librarian login with JWT
- Books, Authors, Members, Transactions, Reservations, Fines APIs
- Service-layer backend architecture
- Dashboard/reports with API-driven frontend
- Notification system:
  - REST notifications endpoints
  - Real-time WebSocket stream (`/ws/notifications/`)
  - Polling fallback in frontend
- Dark/light theme

## Quick Start (Docker) — Recommended

From repository root:

```bash
docker compose up -d --build
```

Open:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000/api/`
- Django admin: `http://localhost:8000/admin/`

Create superuser:

```bash
docker compose exec backend python manage.py createsuperuser
```

## Services

- `db` (PostgreSQL 15) on `5432`
- `redis` on `6379`
- `backend` (Django API) on `8000`
- `celery` (worker)
- `celery-beat` (scheduler)
- `frontend` (Nginx) on `3000`

## Local Development (without Docker)

### Backend

```bash
cd backend
python -m venv .venv
# macOS/Linux
source .venv/bin/activate
# Windows PowerShell
# .\.venv\Scripts\Activate.ps1

pip install -r requirements.txt
```

Set environment variables (SQLite local mode - recommended for local):

```bash
export DEBUG=True
export SECRET_KEY='change-me'
export DATABASE_URL=sqlite:///$(pwd)/backend/db.sqlite3
```

Run backend:

```bash
python manage.py migrate
python manage.py runserver
```

Run background jobs in separate terminals:

```bash
celery -A config worker -l info
celery -A config beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler
```

### Frontend

Serve `frontend/index.html` using any static server, or just run Docker frontend service.

## Windows Notes (Redis/Celery)

Redis is often the hardest part on Windows if you run backend locally without Docker.

### Recommended (most stable)
Use Docker Desktop for the **entire stack**:

```bash
docker compose up -d --build
```

### If you run Django locally on Windows
Run only Redis in Docker:

```bash
docker run -d --name lms-redis -p 6379:6379 redis:7-alpine
```

Set environment variables in PowerShell:

```powershell
$env:CELERY_BROKER_URL = "redis://127.0.0.1:6379/0"
$env:CELERY_RESULT_BACKEND = "redis://127.0.0.1:6379/0"
```

Then start services from `backend/`:

```powershell
python manage.py runserver
celery -A config worker -l info
celery -A config beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler
```

### Quick checks

```powershell
# Redis should respond with PONG (from Docker container)
docker exec -it lms-redis redis-cli ping

# Check backend can run cleanly
python manage.py check
```

### Common Windows issues
- **Port 6379 already in use**: run Redis on another port, e.g. `-p 6380:6379`, and update env URLs to `6380`.
- **Celery cannot connect to Redis**: ensure Docker Desktop is running and container `lms-redis` is up.
- **Firewall/antivirus blocks localhost traffic**: allow Docker/Redis local connections.


### If you use SQLite only (no Redis/Celery locally)
You can run just Django on Windows:

```powershell
$env:DATABASE_URL = "sqlite:///C:/path/to/lms-project/backend/db.sqlite3"
python manage.py migrate
python manage.py runserver
```

In this mode, background notification tasks (Celery beat) are not running automatically.

## Core API Routes

Base: `http://localhost:8000/api`

- Auth: `/auth/login/`, `/auth/profile/`
- Books: `/books/`, `/books/<id>/`, `/books/authors/`, `/books/categories/`
- Members: `/members/`, `/members/<id>/`, `/members/<id>/history/`
- Transactions: `/transactions/`, `/transactions/<id>/return/`
- Reservations: `/transactions/reservations/`, `/transactions/reservations/<id>/approve/`
- Fines: `/fines/`, `/fines/<id>/collect/`, `/fines/settings/`
- Notifications: `/notifications/`, `/notifications/<id>/read/`, `/notifications/mark-all-read/`
- Dashboard/Reports: `/books/dashboard/stats/`, `/books/reports/*`

## Useful Commands

```bash
# logs
docker compose logs -f backend
docker compose logs -f celery
docker compose logs -f celery-beat
docker compose logs -f frontend

# health check
docker compose ps

# tests
docker compose exec backend python manage.py test
```
