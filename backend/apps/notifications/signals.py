from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Notification
from .serializers import NotificationSerializer


def _broadcast_snapshot():
    channel_layer = get_channel_layer()
    if channel_layer is None:
        return

    notifications = Notification.objects.select_related('member').order_by('-created_at')[:5]
    payload = {
        'type': 'notification_snapshot',
        'unread_count': Notification.objects.filter(is_read=False).count(),
        'notifications': NotificationSerializer(notifications, many=True).data,
    }

    async_to_sync(channel_layer.group_send)(
        'notifications_global',
        {
            'type': 'notification_snapshot',
            'payload': payload,
        },
    )


@receiver(post_save, sender=Notification)
def notification_changed(sender, instance, created, **kwargs):
    _broadcast_snapshot()
