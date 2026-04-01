from django.contrib import admin
from .models import Transaction, Reservation


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['member', 'book', 'issue_date', 'due_date', 'return_date', 'status']
    list_filter = ['status', 'issue_date', 'due_date']
    search_fields = ['member__first_name', 'member__last_name', 'book__title']
    readonly_fields = ['issue_date', 'created_at', 'updated_at']


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ['member', 'book', 'reserved_on', 'expires_on', 'status']
    list_filter = ['status', 'reserved_on']
    search_fields = ['member__first_name', 'member__last_name', 'book__title']
