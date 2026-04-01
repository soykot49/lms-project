from django.contrib import admin
from .models import Book, Author, Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name']


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'nationality', 'genre', 'birth_year']
    search_fields = ['first_name', 'last_name', 'nationality']
    list_filter = ['genre', 'nationality']


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'isbn', 'category', 'quantity', 'available_quantity', 'is_available']
    list_filter = ['category', 'author']
    search_fields = ['title', 'isbn', 'author__first_name', 'author__last_name']
    readonly_fields = ['created_at', 'updated_at']
