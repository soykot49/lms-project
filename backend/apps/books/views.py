from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from apps.core.views.base import BaseAPIView
from .models import Book, Author, Category
from .serializers import (
    BookListSerializer, BookDetailSerializer, BookCreateUpdateSerializer,
    AuthorSerializer, AuthorDetailSerializer, CategorySerializer
)
from .services import BookService, AuthorService, CategoryService


class BookListCreateView(BaseAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        service = BookService()
        search_query = request.query_params.get('search', None)
        
        if search_query:
            books = service.search_books(search_query)
        else:
            books = service.list()
        
        serializer = BookListSerializer(books, many=True)
        return self.success_response(serializer.data)
    
    def post(self, request):
        serializer = BookCreateUpdateSerializer(data=request.data)
        if serializer.is_valid():
            service = BookService()
            book = service.create(serializer.validated_data)
            return self.success_response(
                BookDetailSerializer(book).data,
                message="Book created successfully",
                status_code=status.HTTP_201_CREATED
            )
        return self.error_response("Validation failed", errors=serializer.errors)


class BookDetailView(BaseAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk):
        service = BookService()
        book = service.get_object(pk)
        serializer = BookDetailSerializer(book)
        return self.success_response(serializer.data)
    
    def put(self, request, pk):
        service = BookService()
        book = service.get_object(pk)
        serializer = BookCreateUpdateSerializer(book, data=request.data)
        if serializer.is_valid():
            book = service.update(book, serializer.validated_data)
            return self.success_response(
                BookDetailSerializer(book).data,
                message="Book updated successfully"
            )
        return self.error_response("Validation failed", errors=serializer.errors)
    
    def delete(self, request, pk):
        service = BookService()
        book = service.get_object(pk)
        service.delete(book)
        return self.success_response(message="Book deleted successfully")


class AuthorListCreateView(BaseAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        service = AuthorService()
        authors = service.list()
        serializer = AuthorSerializer(authors, many=True)
        return self.success_response(serializer.data)
    
    def post(self, request):
        serializer = AuthorSerializer(data=request.data)
        if serializer.is_valid():
            service = AuthorService()
            author = service.create(serializer.validated_data)
            return self.success_response(
                serializer.data,
                message="Author created successfully",
                status_code=status.HTTP_201_CREATED
            )
        return self.error_response("Validation failed", errors=serializer.errors)


class AuthorDetailView(BaseAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk):
        service = AuthorService()
        author = service.get_object(pk)
        serializer = AuthorDetailSerializer(author)
        return self.success_response(serializer.data)
    
    def put(self, request, pk):
        service = AuthorService()
        author = service.get_object(pk)
        serializer = AuthorSerializer(author, data=request.data)
        if serializer.is_valid():
            author = service.update(author, serializer.validated_data)
            return self.success_response(
                serializer.data,
                message="Author updated successfully"
            )
        return self.error_response("Validation failed", errors=serializer.errors)
    
    def delete(self, request, pk):
        service = AuthorService()
        author = service.get_object(pk)
        service.delete(author)
        return self.success_response(message="Author deleted successfully")


class AuthorBooksView(BaseAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk):
        service = AuthorService()
        books = service.get_author_books(pk)
        serializer = BookListSerializer(books, many=True)
        return self.success_response(serializer.data)


class CategoryListCreateView(BaseAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        service = CategoryService()
        categories = service.list()
        serializer = CategorySerializer(categories, many=True)
        return self.success_response(serializer.data)
    
    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            service = CategoryService()
            category = service.create(serializer.validated_data)
            return self.success_response(
                serializer.data,
                message="Category created successfully",
                status_code=status.HTTP_201_CREATED
            )
        return self.error_response("Validation failed", errors=serializer.errors)


class DashboardStatsView(BaseAPIView):
    """Get dashboard statistics"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        from apps.transactions.models import Transaction
        from apps.members.models import Member
        from apps.fines.models import Fine
        from datetime import date, timedelta
        from django.db.models import Count, Sum, Q
        
        # Total counts
        total_books = Book.objects.count()
        total_members = Member.objects.filter(is_blocked=False).count()
        active_transactions = Transaction.objects.filter(status='issued').count()
        
        # Fines
        total_fines = Fine.objects.filter(status='unpaid').aggregate(
            total=Sum('amount')
        )['total'] or 0
        
        # Overdue books
        overdue_books = Transaction.objects.filter(
            status='issued',
            due_date__lt=date.today()
        ).count()
        
        # Recent activity
        today = date.today()
        week_ago = today - timedelta(days=7)
        
        recent_issues = Transaction.objects.filter(
            issue_date__gte=week_ago
        ).count()
        
        recent_returns = Transaction.objects.filter(
            return_date__gte=week_ago,
            status='returned'
        ).count()
        
        # Monthly borrowing data (last 6 months)
        monthly_data = []
        for i in range(5, -1, -1):
            month_start = (today.replace(day=1) - timedelta(days=i*30)).replace(day=1)
            month_end = (month_start + timedelta(days=32)).replace(day=1) - timedelta(days=1)
            
            issued = Transaction.objects.filter(
                issue_date__gte=month_start,
                issue_date__lte=month_end
            ).count()
            
            returned = Transaction.objects.filter(
                return_date__gte=month_start,
                return_date__lte=month_end,
                status='returned'
            ).count()
            
            monthly_data.append({
                'month': month_start.strftime('%b'),
                'issued': issued,
                'returned': returned
            })
        
        data = {
            'stats': {
                'total_books': total_books,
                'available_books': Book.objects.filter(available_quantity__gt=0).count(),
                'total_members': total_members,
                'active_transactions': active_transactions,
                'overdue_books': overdue_books,
                'total_fines': float(total_fines),
            },
            'recent_activity': {
                'issues_this_week': recent_issues,
                'returns_this_week': recent_returns,
            },
            'monthly_borrowing': monthly_data,
        }
        
        return self.success_response(data)


class InventoryReportView(BaseAPIView):
    """Generate inventory report"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        books = Book.objects.select_related('author', 'category').all()
        
        report = {
            'total_books': books.count(),
            'total_quantity': sum(book.quantity for book in books),
            'available_quantity': sum(book.available_quantity for book in books),
            'categories': {},
            'low_stock': []
        }
        
        # Category-wise breakdown
        for book in books:
            cat_name = book.category.name if book.category else 'Uncategorized'
            if cat_name not in report['categories']:
                report['categories'][cat_name] = {'count': 0, 'quantity': 0}
            report['categories'][cat_name]['count'] += 1
            report['categories'][cat_name]['quantity'] += book.quantity
            
            # Low stock (less than 2 available)
            if book.available_quantity < 2:
                report['low_stock'].append({
                    'title': book.title,
                    'isbn': book.isbn,
                    'available': book.available_quantity
                })
        
        return self.success_response(report)


class CirculationReportView(BaseAPIView):
    """Generate circulation report"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        from apps.transactions.models import Transaction
        from datetime import date, timedelta
        from django.db.models import Count
        
        today = date.today()
        month_ago = today - timedelta(days=30)
        
        transactions = Transaction.objects.filter(issue_date__gte=month_ago)
        
        report = {
            'total_issued': transactions.count(),
            'total_returned': transactions.filter(status='returned').count(),
            'currently_issued': transactions.filter(status='issued').count(),
            'overdue': transactions.filter(status='overdue').count(),
            'most_borrowed_books': [],
            'most_active_members': []
        }
        
        # Most borrowed books
        most_borrowed = Book.objects.annotate(
            borrow_count=Count('transactions')
        ).order_by('-borrow_count')[:10]
        
        report['most_borrowed_books'] = [
            {'title': book.title, 'count': book.borrow_count}
            for book in most_borrowed
        ]
        
        # Most active members
        from apps.members.models import Member
        most_active = Member.objects.annotate(
            borrow_count=Count('transactions')
        ).order_by('-borrow_count')[:10]
        
        report['most_active_members'] = [
            {'name': member.full_name, 'count': member.borrow_count}
            for member in most_active
        ]
        
        return self.success_response(report)


class FinesReportView(BaseAPIView):
    """Generate fines report"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        from apps.fines.models import Fine
        from django.db.models import Sum, Count
        from datetime import date, timedelta
        
        today = date.today()
        month_ago = today - timedelta(days=30)
        year_ago = today - timedelta(days=365)
        
        all_fines = Fine.objects.all()
        
        report = {
            'total_unpaid': float(all_fines.filter(status='unpaid').aggregate(
                total=Sum('amount')
            )['total'] or 0),
            'total_paid_this_month': float(all_fines.filter(
                status='paid',
                paid_at__gte=month_ago
            ).aggregate(total=Sum('amount'))['total'] or 0),
            'total_paid_this_year': float(all_fines.filter(
                status='paid',
                paid_at__gte=year_ago
            ).aggregate(total=Sum('amount'))['total'] or 0),
            'total_waived': float(all_fines.filter(status='waived').aggregate(
                total=Sum('amount')
            )['total'] or 0),
            'members_with_fines': all_fines.filter(status='unpaid').values('member').distinct().count()
        }
        
        return self.success_response(report)


class OverdueReportView(BaseAPIView):
    """Generate overdue report"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        from apps.transactions.models import Transaction
        from datetime import date
        
        today = date.today()
        overdue_transactions = Transaction.objects.filter(
            status__in=['issued', 'overdue'],
            due_date__lt=today
        ).select_related('member', 'book')
        
        report = {
            'total_overdue': overdue_transactions.count(),
            'overdue_items': []
        }
        
        for trans in overdue_transactions:
            days_overdue = (today - trans.due_date).days
            report['overdue_items'].append({
                'member': trans.member.full_name,
                'member_id': trans.member.member_id,
                'book': trans.book.title,
                'due_date': str(trans.due_date),
                'days_overdue': days_overdue
            })
        
        return self.success_response(report)


class MemberReportView(BaseAPIView):
    """Generate member statistics report"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from apps.members.models import Member
        from django.db.models import Count

        members = Member.objects.all()
        report = {
            'total_members': members.count(),
            'active_members': members.filter(is_blocked=False).count(),
            'blocked_members': members.filter(is_blocked=True).count(),
            'by_type': {
                'student': members.filter(member_type='student').count(),
                'faculty': members.filter(member_type='faculty').count(),
                'staff': members.filter(member_type='staff').count(),
            },
            'top_borrowers': [
                {
                    'name': m.full_name,
                    'member_id': m.member_id,
                    'borrow_count': m.borrow_count,
                }
                for m in Member.objects.annotate(
                    borrow_count=Count('transactions')
                ).order_by('-borrow_count')[:10]
            ],
        }
        return self.success_response(report)
