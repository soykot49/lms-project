from django.urls import path
from .views import (
    MemberListCreateView, MemberDetailView,
    MemberBlockView, MemberUnblockView, MemberHistoryView,
    MemberActivateView, MemberDeactivateView,
)

urlpatterns = [
    path('', MemberListCreateView.as_view(), name='member-list-create'),
    path('<int:pk>/', MemberDetailView.as_view(), name='member-detail'),
    path('<int:pk>/activate/', MemberActivateView.as_view(), name='member-activate'),
    path('<int:pk>/deactivate/', MemberDeactivateView.as_view(), name='member-deactivate'),
    path('<int:pk>/block/', MemberBlockView.as_view(), name='member-block'),
    path('<int:pk>/unblock/', MemberUnblockView.as_view(), name='member-unblock'),
    path('<int:pk>/history/', MemberHistoryView.as_view(), name='member-history'),
]
