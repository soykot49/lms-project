# Library Management System (LMS)

This project includes a Django REST backend, PostgreSQL, Redis, Celery worker/beat, and a separate frontend container.

## Stack
- Django 4.2 + DRF + JWT auth
- PostgreSQL 15
- Redis 7
- Celery + django-celery-beat
- Docker Compose (root-level)

## Run with Docker (recommended)
From repository root:

```bash
docker compose up -d --build
```

Services:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000/api/`
- Django Admin: `http://localhost:8000/admin/`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

Create superuser:

```bash
docker compose exec backend python manage.py createsuperuser
```

## Run locally (without Docker)
From `backend/`:

```bash
python -m venv .venv
# macOS/Linux
source .venv/bin/activate
# Windows PowerShell
# .\.venv\Scripts\Activate.ps1

pip install -r requirements.txt
```

Set env vars (example):

```bash
# macOS/Linux
export DEBUG=True
export SECRET_KEY='change-me'
export DB_NAME=lms_db
export DB_USER=lms_user
export DB_PASSWORD=lms_password
export DB_HOST=127.0.0.1
export DB_PORT=5432
export CELERY_BROKER_URL=redis://127.0.0.1:6379/0
export CELERY_RESULT_BACKEND=redis://127.0.0.1:6379/0
```

Then:

```bash
python manage.py migrate
python manage.py runserver
```

In separate terminals:

```bash
celery -A config worker -l info
celery -A config beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler
```

## Windows + Redis/Celery
Best option: use Docker Desktop and run the full stack via `docker compose up -d --build`.

If running Python natively on Windows, run Redis in Docker only:

```bash
docker run -d --name lms-redis -p 6379:6379 redis:7-alpine
```

Then use:
- `CELERY_BROKER_URL=redis://127.0.0.1:6379/0`
- `CELERY_RESULT_BACKEND=redis://127.0.0.1:6379/0`

## API base and key endpoints
Base URL: `http://localhost:8000/api`

- Auth: `/auth/login/`, `/auth/profile/`
- Books: `/books/`, `/books/<id>/`, `/books/authors/`, `/books/categories/`
- Members: `/members/`, `/members/<id>/`, `/members/<id>/block/`
- Transactions: `/transactions/`, `/transactions/<id>/return/`
- Reservations: `/transactions/reservations/`, `/transactions/reservations/<id>/approve/`
- Fines: `/fines/`, `/fines/<id>/collect/`, `/fines/settings/`
- Notifications: `/notifications/`, `/notifications/<id>/read/`, `/notifications/mark-all-read/`
- Dashboard/Reports: `/books/dashboard/stats/`, `/books/reports/*`

## Notification workflow
- Celery beat creates due/overdue/expired reservation checks.
- Notifications are stored in DB and shown in frontend bell + notifications page.
- "Mark read" and "Mark all read" call backend endpoints and update unread count.

## Helpful commands

```bash
# logs
docker compose logs -f backend
docker compose logs -f celery
docker compose logs -f celery-beat

# run tests
docker compose exec backend python manage.py test
```
