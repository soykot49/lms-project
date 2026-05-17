from django.urls import path
from .views import (
    BookListCreateView, BookDetailView,
    AuthorListCreateView, AuthorDetailView, AuthorBooksView,
    CategoryListCreateView,
    DashboardStatsView, InventoryReportView, CirculationReportView,
    FinesReportView, OverdueReportView, MemberReportView
)

urlpatterns = [
    path('', BookListCreateView.as_view(), name='book-list-create'),
    path('<int:pk>/', BookDetailView.as_view(), name='book-detail'),
    path('authors/', AuthorListCreateView.as_view(), name='author-list-create'),
    path('authors/<int:pk>/', AuthorDetailView.as_view(), name='author-detail'),
    path('authors/<int:pk>/books/', AuthorBooksView.as_view(), name='author-books'),
    path('categories/', CategoryListCreateView.as_view(), name='category-list-create'),
]

# Dashboard and Reports
urlpatterns += [
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('reports/inventory/', InventoryReportView.as_view(), name='report-inventory'),
    path('reports/circulation/', CirculationReportView.as_view(), name='report-circulation'),
    path('reports/fines/', FinesReportView.as_view(), name='report-fines'),
    path('reports/overdue/', OverdueReportView.as_view(), name='report-overdue'),
    path('reports/members/', MemberReportView.as_view(), name='report-members'),
]
