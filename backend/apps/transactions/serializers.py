from rest_framework import serializers
from .models import Transaction, Reservation
from apps.members.models import Member
from apps.books.models import Book


class TransactionSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source='member.full_name', read_only=True)
    book_title = serializers.CharField(source='book.title', read_only=True)
    issued_by_name = serializers.CharField(source='issued_by.get_full_name', read_only=True)
    
    class Meta:
        model = Transaction
        fields = '__all__'
        read_only_fields = ['issue_date', 'created_at', 'updated_at']


class TransactionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['member', 'book', 'due_date', 'notes']
        extra_kwargs = {
            'due_date': {'required': False, 'allow_null': True},
            'notes': {'required': False, 'allow_blank': True},
        }


class ReservationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ['member', 'book']


class ReservationSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source='member.full_name', read_only=True)
    book_title = serializers.CharField(source='book.title', read_only=True)
    
    class Meta:
        model = Reservation
        fields = '__all__'
        read_only_fields = ['reserved_on', 'created_at', 'updated_at']
