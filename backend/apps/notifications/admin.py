from django.contrib import admin
from .models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'member', 'audience', 'notification_type', 'is_read', 'created_at')
    list_filter = ('audience', 'notification_type', 'is_read', 'created_at')
    search_fields = ('title', 'message', 'member__first_name', 'member__last_name')
    readonly_fields = ('created_at',)
