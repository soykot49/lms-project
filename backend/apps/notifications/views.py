from rest_framework import status
from apps.accounts.permissions import IsStaffUser
from apps.core.views.base import BaseAPIView
from .models import Notification
from .serializers import NotificationSerializer
from .services import NotificationService
from .bulk_notify import BulkNotificationService


class NotificationListView(BaseAPIView):
    permission_classes = [IsStaffUser]
    
    def get(self, request):
        # For admin, get all notifications
        # For specific member, filter by member_id if provided
        member_id = request.query_params.get('member_id')
        audience = request.query_params.get('audience')

        service = NotificationService()
        if member_id:
            notifications = service.get_member_notifications(int(member_id))
        else:
            notifications = service.list()

        if audience in ('member', 'staff'):
            notifications = notifications.filter(audience=audience)
        
        serializer = NotificationSerializer(notifications, many=True)
        return self.success_response(serializer.data)


class NotificationMarkReadView(BaseAPIView):
    permission_classes = [IsStaffUser]
    
    def post(self, request, pk):
        service = NotificationService()
        notification = service.mark_as_read(pk)
        return self.success_response(
            NotificationSerializer(notification).data,
            message="Notification marked as read"
        )


class BulkNotifyPreviewView(BaseAPIView):
    permission_classes = [IsStaffUser]

    def get(self, request):
        target = request.query_params.get('target', 'all')
        if target not in BulkNotificationService.VALID_TARGETS:
            return self.error_response('Invalid target. Use: overdue, fines, or all')
        preview = BulkNotificationService().get_preview(target=target)
        return self.success_response(preview)


class BulkNotifySendView(BaseAPIView):
    permission_classes = [IsStaffUser]

    def post(self, request):
        target = request.data.get('target', 'all')
        if target not in BulkNotificationService.VALID_TARGETS:
            return self.error_response('Invalid target. Use: overdue, fines, or all')
        result = BulkNotificationService().send_bulk_reminders(target=target)
        return self.success_response(
            result,
            message=f"Sent reminders to {result['members_notified']} member(s)",
        )


class NotificationMarkAllReadView(BaseAPIView):
    permission_classes = [IsStaffUser]
    
    def post(self, request):
        member_id = request.data.get('member_id')

        service = NotificationService()
        count = service.mark_all_as_read(int(member_id) if member_id else None)
        return self.success_response(
            {'count': count},
            message=f"Marked {count} notification(s) as read"
        )
