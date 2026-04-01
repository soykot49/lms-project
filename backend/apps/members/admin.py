from django.contrib import admin
from .models import Member


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ['member_id', 'full_name', 'email', 'member_type', 'is_blocked', 'created_at']
    list_filter = ['member_type', 'is_blocked']
    search_fields = ['member_id', 'first_name', 'last_name', 'email']
    readonly_fields = ['created_at', 'updated_at']
