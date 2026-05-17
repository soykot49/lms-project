from rest_framework import status
from apps.accounts.permissions import IsStaffUser
from apps.core.views.base import BaseAPIView
from .models import Member
from .serializers import MemberSerializer, MemberDetailSerializer, MemberCreateSerializer
from .services import MemberService
from apps.transactions.serializers import TransactionSerializer


class MemberListCreateView(BaseAPIView):
    permission_classes = [IsStaffUser]
    
    def get(self, request):
        service = MemberService()
        members = service.list()
        serializer = MemberSerializer(members, many=True)
        return self.success_response(serializer.data)
    
    def post(self, request):
        serializer = MemberCreateSerializer(data=request.data)
        if serializer.is_valid():
            service = MemberService()
            member = service.create_with_account(serializer.validated_data)
            return self.success_response(
                MemberSerializer(member).data,
                message="Member created successfully",
                status_code=status.HTTP_201_CREATED
            )
        return self.error_response("Validation failed", errors=serializer.errors)


class MemberDetailView(BaseAPIView):
    permission_classes = [IsStaffUser]
    
    def get(self, request, pk):
        service = MemberService()
        member = service.get_object(pk)
        serializer = MemberDetailSerializer(member)
        return self.success_response(serializer.data)
    
    def put(self, request, pk):
        service = MemberService()
        member = service.get_object(pk)
        serializer = MemberSerializer(member, data=request.data, partial=True)
        if serializer.is_valid():
            member = service.update(member, serializer.validated_data)
            return self.success_response(
                MemberSerializer(member).data,
                message="Member updated successfully"
            )
        return self.error_response("Validation failed", errors=serializer.errors)
    
    def delete(self, request, pk):
        service = MemberService()
        member = service.get_object(pk)
        service.delete(member)
        return self.success_response(message="Member deleted successfully")


class MemberActivateView(BaseAPIView):
    permission_classes = [IsStaffUser]

    def post(self, request, pk):
        service = MemberService()
        member = service.activate_account(pk)
        return self.success_response(
            MemberSerializer(member).data,
            message='Member account activated successfully',
        )


class MemberDeactivateView(BaseAPIView):
    permission_classes = [IsStaffUser]

    def post(self, request, pk):
        service = MemberService()
        member = service.deactivate_account(pk)
        return self.success_response(
            MemberSerializer(member).data,
            message='Member account deactivated',
        )


class MemberBlockView(BaseAPIView):
    permission_classes = [IsStaffUser]
    
    def post(self, request, pk):
        service = MemberService()
        member = service.block_member(pk)
        return self.success_response(
            MemberSerializer(member).data,
            message="Member blocked successfully"
        )


class MemberUnblockView(BaseAPIView):
    permission_classes = [IsStaffUser]
    
    def post(self, request, pk):
        service = MemberService()
        member = service.unblock_member(pk)
        return self.success_response(
            MemberSerializer(member).data,
            message="Member unblocked successfully"
        )


class MemberHistoryView(BaseAPIView):
    permission_classes = [IsStaffUser]
    
    def get(self, request, pk):
        service = MemberService()
        history = service.get_member_history(pk)
        serializer = TransactionSerializer(history, many=True)
        return self.success_response(serializer.data)
