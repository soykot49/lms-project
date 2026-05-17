from apps.core.services.base import BaseService
from .models import Notification


class NotificationService(BaseService):
    model = Notification
    
    def create_notification(
        self,
        member_id: int,
        title: str,
        message: str,
        notification_type: str = 'general',
        audience: str = 'member',
    ):
        '''Create a notification (member-facing or staff alert tied to a member).'''
        return self.model.objects.create(
            member_id=member_id,
            title=title,
            message=message,
            notification_type=notification_type,
            audience=audience,
        )

    def create_staff_alert(
        self,
        member_id: int,
        title: str,
        message: str,
        notification_type: str = 'overdue',
    ):
        return self.create_notification(
            member_id=member_id,
            title=title,
            message=message,
            notification_type=notification_type,
            audience='staff',
        )
    
    def mark_as_read(self, notification_id: int):
        '''Mark a notification as read'''
        notification = self.get_object(notification_id)
        notification.is_read = True
        notification.save()
        return notification
    
    def mark_all_as_read(self, member_id: int | None = None):
        '''Mark all unread notifications as read (optionally for a member)'''
        notifications = self.model.objects.filter(is_read=False)
        if member_id is not None:
            notifications = notifications.filter(member_id=member_id)
        notifications.update(is_read=True)
        return notifications.count()
    
    def get_unread_notifications(self, member_id: int):
        '''Get unread notifications for a member'''
        return self.model.objects.filter(member_id=member_id, is_read=False)
    
    def get_member_notifications(self, member_id: int):
        '''Get all notifications for a member'''
        return self.model.objects.filter(member_id=member_id)
