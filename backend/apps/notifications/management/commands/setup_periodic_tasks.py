from django.core.management.base import BaseCommand
from django_celery_beat.models import CrontabSchedule, PeriodicTask
import json


class Command(BaseCommand):
    help = 'Create/update periodic Celery tasks for notification automation.'

    def handle(self, *args, **options):
        nine_am, _ = CrontabSchedule.objects.get_or_create(minute='0', hour='9', day_of_week='*', day_of_month='*', month_of_year='*')
        ten_am, _ = CrontabSchedule.objects.get_or_create(minute='0', hour='10', day_of_week='*', day_of_month='*', month_of_year='*')
        eleven_am, _ = CrontabSchedule.objects.get_or_create(minute='0', hour='11', day_of_week='*', day_of_month='*', month_of_year='*')

        tasks = [
            ('Send Due Date Reminders', 'apps.notifications.tasks.send_due_date_reminders', nine_am),
            ('Send Overdue Notifications', 'apps.notifications.tasks.send_overdue_notifications', ten_am),
            ('Check Expired Reservations', 'apps.notifications.tasks.check_expired_reservations', eleven_am),
        ]

        created = 0
        updated = 0
        for name, task_path, schedule in tasks:
            obj, was_created = PeriodicTask.objects.update_or_create(
                name=name,
                defaults={
                    'task': task_path,
                    'crontab': schedule,
                    'enabled': True,
                    'args': json.dumps([]),
                    'kwargs': json.dumps({}),
                },
            )
            if was_created:
                created += 1
            else:
                updated += 1

        self.stdout.write(self.style.SUCCESS(f'Periodic tasks ready (created={created}, updated={updated})'))
