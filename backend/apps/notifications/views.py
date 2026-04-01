from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from apps.core.views.base import BaseAPIView
from .models import Notification
from .serializers import NotificationSerializer
from .services import NotificationService


class NotificationListView(BaseAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # For admin, get all notifications
        # For specific member, filter by member_id if provided
        member_id = request.query_params.get('member_id')
        
        service = NotificationService()
        if member_id:
            notifications = service.get_member_notifications(int(member_id))
        else:
            notifications = service.list()
        
        serializer = NotificationSerializer(notifications, many=True)
        return self.success_response(serializer.data)


class NotificationMarkReadView(BaseAPIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, pk):
        service = NotificationService()
        notification = service.mark_as_read(pk)
        return self.success_response(
            NotificationSerializer(notification).data,
            message="Notification marked as read"
        )


class NotificationMarkAllReadView(BaseAPIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        member_id = request.data.get('member_id')

        service = NotificationService()
        count = service.mark_all_as_read(int(member_id) if member_id else None)
        return self.success_response(
            {'count': count},
            message=f"Marked {count} notification(s) as read"
        )
