from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.accounts.urls')),
    path('api/books/', include('apps.books.urls')),
    path('api/members/', include('apps.members.urls')),
    path('api/transactions/', include('apps.transactions.urls')),
    path('api/fines/', include('apps.fines.urls')),
    path('api/notifications/', include('apps.notifications.urls')),
]
