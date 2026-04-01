from django.urls import path
from .views import (
    FineListView, FineDetailView,
    FineCollectView, FineWaiveView,
    FineSettingsView
)

urlpatterns = [
    path('', FineListView.as_view(), name='fine-list'),
    path('<int:pk>/', FineDetailView.as_view(), name='fine-detail'),
    path('<int:pk>/collect/', FineCollectView.as_view(), name='fine-collect'),
    path('<int:pk>/waive/', FineWaiveView.as_view(), name='fine-waive'),
    path('settings/', FineSettingsView.as_view(), name='fine-settings'),
]
