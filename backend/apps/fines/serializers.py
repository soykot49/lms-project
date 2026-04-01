from rest_framework import serializers
from .models import Fine, FineSettings


class FineSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source='member.full_name', read_only=True)
    book_title = serializers.CharField(source='transaction.book.title', read_only=True)
    days_overdue = serializers.SerializerMethodField()
    
    class Meta:
        model = Fine
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
    
    def get_days_overdue(self, obj):
        from datetime import date
        if obj.transaction.return_date:
            return (obj.transaction.return_date - obj.transaction.due_date).days
        return (date.today() - obj.transaction.due_date).days


class FineSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FineSettings
        fields = '__all__'
