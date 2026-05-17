from django.db import models
from apps.members.models import Member


class Notification(models.Model):
    AUDIENCE_CHOICES = [
        ('member', 'Member'),
        ('staff', 'Staff'),
    ]

    TYPE_CHOICES = [
        ('issue', 'Book Issue'),
        ('return', 'Book Return'),
        ('overdue', 'Overdue'),
        ('fine', 'Fine'),
        ('reservation', 'Reservation'),
        ('general', 'General'),
    ]
    
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='notifications')
    audience = models.CharField(max_length=10, choices=AUDIENCE_CHOICES, default='member')
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='general')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.member}"
