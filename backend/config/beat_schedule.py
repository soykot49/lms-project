"""
Celery Beat schedule — single source of truth (crontab).

Loaded in Django settings as CELERY_BEAT_SCHEDULE.
Beat runner: celery -A config beat --loglevel=info
"""
from celery.schedules import crontab

from config.env import env

BEAT_SCHEDULE = {
    'daily-due-date-reminders': {
        'task': 'apps.notifications.tasks.send_due_date_reminders',
        'schedule': crontab(
            hour=int(env('REMINDER_TASK_HOUR', default=9)),
            minute=int(env('REMINDER_TASK_MINUTE', default=0)),
        ),
    },
    'daily-process-overdue-loans': {
        'task': 'apps.notifications.tasks.process_overdue_loans',
        'schedule': crontab(
            hour=int(env('OVERDUE_TASK_HOUR', default=10)),
            minute=int(env('OVERDUE_TASK_MINUTE', default=0)),
        ),
    },
    'daily-check-expired-reservations': {
        'task': 'apps.notifications.tasks.check_expired_reservations',
        'schedule': crontab(
            hour=int(env('RESERVATION_TASK_HOUR', default=11)),
            minute=int(env('RESERVATION_TASK_MINUTE', default=0)),
        ),
    },
    'daily-process-overdue-loans-evening': {
        'task': 'apps.notifications.tasks.process_overdue_loans',
        'schedule': crontab(
            hour=int(env('OVERDUE_EVENING_TASK_HOUR', default=18)),
            minute=int(env('OVERDUE_EVENING_TASK_MINUTE', default=0)),
        ),
    },
}
