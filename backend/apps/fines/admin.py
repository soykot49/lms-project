from django.contrib import admin
from .models import Fine, FineSettings


@admin.register(Fine)
class FineAdmin(admin.ModelAdmin):
    list_display = ['member', 'amount', 'status', 'created_at', 'paid_at', 'waived_at']
    list_filter = ['status', 'created_at']
    search_fields = ['member__first_name', 'member__last_name']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(FineSettings)
class FineSettingsAdmin(admin.ModelAdmin):
    list_display = ['fine_per_day', 'updated_at']
    
    def has_add_permission(self, request):
        # Only allow one instance
        return not FineSettings.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        return False
