#!/bin/bash

echo "🚀 Starting Library Management System Backend..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "✓ Created .env file. Please update it with your settings if needed."
    echo ""
fi

# Build and start services
echo "📦 Building Docker containers..."
docker-compose build

echo ""
echo "🔧 Starting services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for database to be ready..."
sleep 5

echo ""
echo "📊 Running migrations..."
docker-compose exec backend python manage.py migrate

echo ""
echo "🎲 Initializing sample data..."
docker-compose exec backend python manage.py init_data

echo ""
echo "✅ Library Management System is ready!"
echo ""
echo "📍 URLs:"
echo "   - API: http://localhost:8000/api/"
echo "   - Admin: http://localhost:8000/admin/"
echo ""
echo "🔑 Login credentials:"
echo "   - Admin: admin@lms.com / admin123"
echo "   - Librarian: librarian@lms.com / librarian123"
echo ""
echo "📝 Useful commands:"
echo "   - View logs: docker-compose logs -f"
echo "   - Stop services: docker-compose down"
echo "   - Restart: docker-compose restart"
echo ""
