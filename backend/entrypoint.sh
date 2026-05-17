#!/bin/bash

set -e

echo "Waiting for postgres..."
while ! nc -z db 5432; do
  sleep 0.1
done
echo "PostgreSQL started"

echo "Waiting for redis..."
while ! nc -z redis 6379; do
  sleep 0.1
done
echo "Redis started"

if [[ "$*" == *"runserver"* ]] || [[ "$*" == *"daphne"* ]]; then
  echo "Running migrations..."
  python manage.py migrate --noinput
  python manage.py setup_periodic_tasks || true
  echo "Collecting static files..."
  python manage.py collectstatic --noinput
fi

if [[ "$*" == *"beat"* ]]; then
  echo "Celery Beat schedule (from config/beat_schedule.py):"
  python manage.py list_periodic_tasks || true
fi

echo "Starting command: $*"
exec "$@"
