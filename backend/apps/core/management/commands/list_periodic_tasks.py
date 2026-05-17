from django.conf import settings
from django.core.management.base import BaseCommand


def _format_crontab(celery_crontab):
    hour = min(celery_crontab.hour) if celery_crontab.hour else '*'
    minute = min(celery_crontab.minute) if celery_crontab.minute else '*'
    return f'{hour:02d}:{minute:02d}' if hour != '*' else f'*:{minute:02d}'


class Command(BaseCommand):
    help = 'List Celery Beat tasks from CELERY_BEAT_SCHEDULE (config/beat_schedule.py).'

    def handle(self, *args, **options):
        beat_schedule = getattr(settings, 'CELERY_BEAT_SCHEDULE', {})
        if not beat_schedule:
            self.stdout.write(self.style.WARNING('CELERY_BEAT_SCHEDULE is empty.'))
            return

        self.stdout.write(self.style.SUCCESS(f'CELERY_BEAT_SCHEDULE ({len(beat_schedule)} tasks):\n'))
        for key, entry in beat_schedule.items():
            schedule = entry.get('schedule')
            when = _format_crontab(schedule) if schedule else '—'
            self.stdout.write(f'  [{key}]')
            self.stdout.write(f'    task: {entry.get("task")}')
            self.stdout.write(f'    crontab: {when} ({settings.TIME_ZONE})')
            if entry.get('options'):
                self.stdout.write(f'    options: {entry["options"]}')
            self.stdout.write('')
