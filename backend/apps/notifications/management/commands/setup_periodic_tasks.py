"""
Optional: mirror CELERY_BEAT_SCHEDULE into django-celery-beat DB for Django admin UI.

Beat itself uses CELERY_BEAT_SCHEDULE from config/beat_schedule.py (not the DB).
"""
import json

from django.conf import settings
from django.core.management.base import BaseCommand
from django.utils import timezone
from django_celery_beat.models import CrontabSchedule, PeriodicTask


def _hour_minute_from_crontab(celery_crontab):
    hour = min(celery_crontab.hour) if celery_crontab.hour else 0
    minute = min(celery_crontab.minute) if celery_crontab.minute else 0
    return int(hour), int(minute)


class Command(BaseCommand):
    help = 'Mirror CELERY_BEAT_SCHEDULE into django-celery-beat (admin visibility only).'

    def handle(self, *args, **options):
        tz = timezone.get_current_timezone()
        beat_schedule = getattr(settings, 'CELERY_BEAT_SCHEDULE', {})
        created = updated = 0

        for key, entry in beat_schedule.items():
            task_path = entry['task']
            hour, minute = _hour_minute_from_crontab(entry['schedule'])
            name = key.replace('-', ' ').title()

            schedule, _ = CrontabSchedule.objects.get_or_create(
                minute=str(minute),
                hour=str(hour),
                day_of_week='*',
                day_of_month='*',
                month_of_year='*',
                timezone=tz,
            )
            _, was_created = PeriodicTask.objects.update_or_create(
                name=name,
                defaults={
                    'task': task_path,
                    'crontab': schedule,
                    'enabled': True,
                    'args': json.dumps(entry.get('args', [])),
                    'kwargs': json.dumps(entry.get('kwargs', {})),
                },
            )
            if was_created:
                created += 1
            else:
                updated += 1
            self.stdout.write(f'  ✓ {name} — {hour:02d}:{minute:02d} → {task_path}')

        PeriodicTask.objects.filter(name='Send Overdue Notifications').update(enabled=False)

        self.stdout.write(
            self.style.SUCCESS(
                f'Mirrored {len(beat_schedule)} task(s) to DB (created={created}, updated={updated}). '
                'Beat uses CELERY_BEAT_SCHEDULE from config/beat_schedule.py.'
            )
        )
