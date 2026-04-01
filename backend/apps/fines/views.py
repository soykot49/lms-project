from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from apps.core.views.base import BaseAPIView
from .models import Fine, FineSettings
from .serializers import FineSerializer, FineSettingsSerializer
from .services import FineService, FineSettingsService


class FineListView(BaseAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        service = FineService()
        fines = service.list()
        serializer = FineSerializer(fines, many=True)
        return self.success_response(serializer.data)


class FineDetailView(BaseAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk):
        service = FineService()
        fine = service.get_object(pk)
        serializer = FineSerializer(fine)
        return self.success_response(serializer.data)


class FineCollectView(BaseAPIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, pk):
        service = FineService()
        fine = service.collect_fine(pk)
        return self.success_response(
            FineSerializer(fine).data,
            message="Fine collected successfully"
        )


class FineWaiveView(BaseAPIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, pk):
        service = FineService()
        fine = service.waive_fine(pk)
        return self.success_response(
            FineSerializer(fine).data,
            message="Fine waived successfully"
        )


class FineSettingsView(BaseAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        service = FineSettingsService()
        settings = service.get_settings()
        serializer = FineSettingsSerializer(settings)
        return self.success_response(serializer.data)
    
    def put(self, request):
        serializer = FineSettingsSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            service = FineSettingsService()
            settings = service.update_settings(
                fine_per_day=serializer.validated_data['fine_per_day']
            )
            return self.success_response(
                FineSettingsSerializer(settings).data,
                message="Settings updated successfully"
            )
        return self.error_response("Validation failed", errors=serializer.errors)
