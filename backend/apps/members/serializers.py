from rest_framework import serializers
from .models import Member


class MemberSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    active_borrowings = serializers.SerializerMethodField()
    unpaid_fines_amount = serializers.SerializerMethodField()

    class Meta:
        model = Member
        fields = '__all__'

    def get_active_borrowings(self, obj):
        return obj.transactions.filter(status__in=['issued', 'overdue']).count()

    def get_unpaid_fines_amount(self, obj):
        from apps.fines.models import Fine
        from django.db.models import Sum
        total = Fine.objects.filter(member=obj, status='unpaid').aggregate(
            total=Sum('amount')
        )['total']
        return float(total or 0)
    
    def validate_member_id(self, value):
        queryset = Member.objects.filter(member_id=value)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)
        if queryset.exists():
            raise serializers.ValidationError("Member ID already exists")
        return value


class MemberDetailSerializer(MemberSerializer):
    books_borrowed = serializers.SerializerMethodField()
    outstanding_fines = serializers.SerializerMethodField()
    
    def get_books_borrowed(self, obj):
        return obj.transactions.filter(status='issued').count()
    
    def get_outstanding_fines(self, obj):
        from apps.fines.models import Fine
        fines = Fine.objects.filter(member=obj, status='unpaid')
        return sum(fine.amount for fine in fines)
