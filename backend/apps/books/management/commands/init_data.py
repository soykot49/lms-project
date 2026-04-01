from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.books.models import Category, Author, Book
from apps.members.models import Member
from apps.fines.models import FineSettings

User = get_user_model()


class Command(BaseCommand):
    help = 'Initialize database with sample data'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')

        # Create admin user if not exists
        if not User.objects.filter(email='admin@lms.com').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@lms.com',
                password='admin123',
                first_name='Admin',
                last_name='User',
                role='admin'
            )
            self.stdout.write(self.style.SUCCESS('✓ Created admin user (admin@lms.com / admin123)'))

        # Create librarian user if not exists
        if not User.objects.filter(email='librarian@lms.com').exists():
            User.objects.create_user(
                username='librarian',
                email='librarian@lms.com',
                password='librarian123',
                first_name='Librarian',
                last_name='User',
                role='librarian'
            )
            self.stdout.write(self.style.SUCCESS('✓ Created librarian user (librarian@lms.com / librarian123)'))

        # Initialize fine settings
        fine_settings, created = FineSettings.objects.get_or_create(
            id=1,
            defaults={'fine_per_day': 10}
        )
        if created:
            self.stdout.write(self.style.SUCCESS('✓ Initialized fine settings (10 per day)'))

        # Create categories
        categories_data = [
            {'name': 'Fiction', 'description': 'Fiction and literature books'},
            {'name': 'Non-Fiction', 'description': 'Non-fiction and educational books'},
            {'name': 'Science', 'description': 'Science and technology books'},
            {'name': 'History', 'description': 'History and biography books'},
            {'name': 'Programming', 'description': 'Programming and computer science books'},
        ]
        
        categories = {}
        for cat_data in categories_data:
            cat, created = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults={'description': cat_data['description']}
            )
            categories[cat_data['name']] = cat
            if created:
                self.stdout.write(f'  Created category: {cat.name}')

        # Create authors
        authors_data = [
            {'first_name': 'George', 'last_name': 'Orwell', 'nationality': 'British', 'birth_year': 1903},
            {'first_name': 'J.K.', 'last_name': 'Rowling', 'nationality': 'British', 'birth_year': 1965},
            {'first_name': 'Isaac', 'last_name': 'Asimov', 'nationality': 'American', 'birth_year': 1920},
            {'first_name': 'Yuval Noah', 'last_name': 'Harari', 'nationality': 'Israeli', 'birth_year': 1976},
            {'first_name': 'Robert C.', 'last_name': 'Martin', 'nationality': 'American'},
        ]
        
        authors = {}
        for author_data in authors_data:
            author, created = Author.objects.get_or_create(
                first_name=author_data['first_name'],
                last_name=author_data['last_name'],
                defaults={
                    'nationality': author_data.get('nationality', ''),
                    'birth_year': author_data.get('birth_year')
                }
            )
            authors[f"{author_data['first_name']} {author_data['last_name']}"] = author
            if created:
                self.stdout.write(f'  Created author: {author.full_name}')

        # Create books
        books_data = [
            {
                'title': '1984',
                'isbn': '9780451524935',
                'author': 'George Orwell',
                'category': 'Fiction',
                'description': 'A dystopian social science fiction novel',
                'published_year': 1949,
                'quantity': 5
            },
            {
                'title': 'Harry Potter and the Philosopher\'s Stone',
                'isbn': '9780439708180',
                'author': 'J.K. Rowling',
                'category': 'Fiction',
                'description': 'First book in the Harry Potter series',
                'published_year': 1997,
                'quantity': 8
            },
            {
                'title': 'Foundation',
                'isbn': '9780553293357',
                'author': 'Isaac Asimov',
                'category': 'Fiction',
                'description': 'Science fiction novel about the fall of civilization',
                'published_year': 1951,
                'quantity': 3
            },
            {
                'title': 'Sapiens: A Brief History of Humankind',
                'isbn': '9780062316097',
                'author': 'Yuval Noah Harari',
                'category': 'Non-Fiction',
                'description': 'Explores the history of humankind',
                'published_year': 2011,
                'quantity': 6
            },
            {
                'title': 'Clean Code',
                'isbn': '9780132350884',
                'author': 'Robert C. Martin',
                'category': 'Programming',
                'description': 'A handbook of agile software craftsmanship',
                'published_year': 2008,
                'quantity': 4
            },
        ]
        
        for book_data in books_data:
            author = authors[book_data['author']]
            category = categories[book_data['category']]
            
            book, created = Book.objects.get_or_create(
                isbn=book_data['isbn'],
                defaults={
                    'title': book_data['title'],
                    'author': author,
                    'category': category,
                    'description': book_data['description'],
                    'published_year': book_data['published_year'],
                    'quantity': book_data['quantity'],
                    'available_quantity': book_data['quantity']
                }
            )
            if created:
                self.stdout.write(f'  Created book: {book.title}')

        # Create sample members
        members_data = [
            {
                'member_id': 'STU001',
                'first_name': 'John',
                'last_name': 'Doe',
                'email': 'john.doe@example.com',
                'phone': '1234567890',
                'member_type': 'student'
            },
            {
                'member_id': 'STU002',
                'first_name': 'Jane',
                'last_name': 'Smith',
                'email': 'jane.smith@example.com',
                'phone': '1234567891',
                'member_type': 'student'
            },
            {
                'member_id': 'FAC001',
                'first_name': 'Dr. Robert',
                'last_name': 'Johnson',
                'email': 'robert.j@example.com',
                'phone': '1234567892',
                'member_type': 'faculty'
            },
        ]
        
        for member_data in members_data:
            member, created = Member.objects.get_or_create(
                member_id=member_data['member_id'],
                defaults={
                    'first_name': member_data['first_name'],
                    'last_name': member_data['last_name'],
                    'email': member_data['email'],
                    'phone': member_data['phone'],
                    'member_type': member_data['member_type']
                }
            )
            if created:
                self.stdout.write(f'  Created member: {member.full_name}')

        self.stdout.write(self.style.SUCCESS('\n✅ Sample data initialized successfully!'))
        self.stdout.write(self.style.SUCCESS('\nYou can now login with:'))
        self.stdout.write('  Admin: admin@lms.com / admin123')
        self.stdout.write('  Librarian: librarian@lms.com / librarian123')
