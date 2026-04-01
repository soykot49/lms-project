#!/bin/bash

set -e

echo "Waiting for postgres..."
while ! nc -z db 5432; do
  sleep 0.1
done
echo "PostgreSQL started"

# Run migrations only for web process to prevent concurrent migration races
# when celery and celery-beat start at the same time.
if [[ "$*" == *"runserver"* ]]; then
  echo "Running migrations..."
  python manage.py migrate --noinput
  python manage.py setup_periodic_tasks || true
else
  echo "Skipping migrations for non-web process"
fi

echo "Starting command: $*"
exec "$@"
