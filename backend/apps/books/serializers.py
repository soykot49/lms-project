from rest_framework import serializers
from .models import Book, Author, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class AuthorSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    books_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Author
        fields = '__all__'
    
    def get_books_count(self, obj):
        return obj.books.count()


class AuthorDetailSerializer(AuthorSerializer):
    books = serializers.SerializerMethodField()
    
    def get_books(self, obj):
        books = obj.books.all()[:10]
        return BookListSerializer(books, many=True).data


class BookListSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.full_name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    is_available = serializers.ReadOnlyField()
    
    class Meta:
        model = Book
        fields = ['id', 'title', 'isbn', 'author_name', 'category_name', 
                  'quantity', 'available_quantity', 'is_available', 'published_year']


class BookDetailSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    is_available = serializers.ReadOnlyField()
    
    class Meta:
        model = Book
        fields = '__all__'


class BookCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'
    
    def validate_isbn(self, value):
        if len(value) not in [10, 13]:
            raise serializers.ValidationError("ISBN must be 10 or 13 characters")
        return value
    
    def validate(self, attrs):
        if attrs.get('available_quantity', 0) > attrs.get('quantity', 0):
            raise serializers.ValidationError("Available quantity cannot exceed total quantity")
        return attrs
