from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from apps.core.views.base import BaseAPIView
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer
from .services import AuthService


class RegisterView(BaseAPIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return self.success_response(
                UserSerializer(user).data,
                message="User registered successfully",
                status_code=status.HTTP_201_CREATED
            )
        return self.error_response(
            "Registration failed",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )


class LoginView(BaseAPIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return self.error_response("Invalid data", errors=serializer.errors)
        
        auth_service = AuthService()
        user = auth_service.authenticate_user(
            email=serializer.validated_data['email'],
            password=serializer.validated_data['password']
        )
        
        refresh = RefreshToken.for_user(user)
        return self.success_response({
            'user': UserSerializer(user).data,
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }
        }, message="Login successful")


class LogoutView(BaseAPIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return self.success_response(message="Logout successful")
        except Exception as e:
            return self.error_response("Invalid token", status_code=status.HTTP_400_BAD_REQUEST)


class ProfileView(BaseAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return self.success_response(serializer.data)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return self.success_response(
                serializer.data,
                message="Profile updated successfully",
            )
        return self.error_response("Validation failed", errors=serializer.errors)
