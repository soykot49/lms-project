from django.urls import path
from .views import (
    NotificationListView,
    NotificationMarkReadView,
    NotificationMarkAllReadView,
    BulkNotifyPreviewView,
    BulkNotifySendView,
)

urlpatterns = [
    path('', NotificationListView.as_view(), name='notification-list'),
    path('bulk-notify/preview/', BulkNotifyPreviewView.as_view(), name='bulk-notify-preview'),
    path('bulk-notify/send/', BulkNotifySendView.as_view(), name='bulk-notify-send'),
    path('mark-all-read/', NotificationMarkAllReadView.as_view(), name='notification-mark-all-read'),
    path('<int:pk>/read/', NotificationMarkReadView.as_view(), name='notification-mark-read'),
]
