from django.core.management.base import BaseCommand
from apps.notifications.tasks import process_overdue_loans


class Command(BaseCommand):
    help = 'Run overdue processing immediately (marks overdue, fines, notifications).'

    def handle(self, *args, **options):
        result = process_overdue_loans()
        self.stdout.write(self.style.SUCCESS(str(result)))
