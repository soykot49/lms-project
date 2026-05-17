import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Notification
from .serializers import NotificationSerializer


class NotificationConsumer(AsyncWebsocketConsumer):
    group_name = 'notifications_global'

    async def connect(self):
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        await self.send_initial_snapshot()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data=None, bytes_data=None):
        # Client can request a refresh explicitly
        if text_data:
            try:
                payload = json.loads(text_data)
            except json.JSONDecodeError:
                return
            if payload.get('type') == 'refresh':
                await self.send_initial_snapshot()

    async def notification_snapshot(self, event):
        await self.send(text_data=json.dumps(event['payload']))

    async def send_initial_snapshot(self):
        payload = await self._get_snapshot_payload()
        await self.send(text_data=json.dumps(payload))

    @database_sync_to_async
    def _get_snapshot_payload(self):
        notifications = Notification.objects.select_related('member').order_by('-created_at')[:5]
        unread_count = Notification.objects.filter(
            is_read=False,
            audience='staff',
        ).count()
        data = NotificationSerializer(notifications, many=True).data
        return {
            'type': 'notification_snapshot',
            'unread_count': unread_count,
            'notifications': data,
        }
