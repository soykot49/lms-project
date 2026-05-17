from django.db.models import Q
from apps.core.services.base import BaseService
from apps.core.exceptions import ValidationException, BusinessLogicException
from .models import Book, Author, Category


class BookService(BaseService):
    model = Book
    
    def search_books(self, query: str):
        '''Search books by title, author, or ISBN'''
        return self.model.objects.filter(
            Q(title__icontains=query) |
            Q(author__first_name__icontains=query) |
            Q(author__last_name__icontains=query) |
            Q(isbn__icontains=query)
        ).select_related('author', 'category')
    
    def check_availability(self, book_id: int) -> bool:
        '''Check if book is available for borrowing'''
        book = self.get_object(book_id)
        return book.available_quantity > 0
    
    def decrease_availability(self, book_id: int):
        '''Decrease available quantity when book is issued'''
        book = self.get_object(book_id)
        if book.available_quantity <= 0:
            raise BusinessLogicException("Book is not available")
        book.available_quantity -= 1
        book.save()
        return book
    
    def increase_availability(self, book_id: int):
        '''Increase available quantity when book is returned'''
        book = self.get_object(book_id)
        if book.available_quantity >= book.quantity:
            raise BusinessLogicException("Cannot increase beyond total quantity")
        book.available_quantity += 1
        book.save()
        return book

    def delete(self, instance):
        from apps.transactions.models import Transaction
        if Transaction.objects.filter(book=instance, status__in=['issued', 'overdue']).exists():
            raise BusinessLogicException(
                'Cannot delete this book while copies are on loan. Return all copies first.'
            )
        instance.delete()


class AuthorService(BaseService):
    model = Author

    def delete(self, instance):
        book_count = instance.books.count()
        if book_count:
            raise BusinessLogicException(
                f'Cannot delete author with {book_count} linked book(s). Delete those books first.'
            )
        instance.delete()
    
    def get_author_books(self, author_id: int):
        '''Get all books by an author'''
        author = self.get_object(author_id)
        return author.books.all()


class CategoryService(BaseService):
    model = Category
