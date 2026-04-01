#!/bin/bash

set -e

echo "🚀 Starting Library Management System Backend..."
echo ""

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

# Build and start services
echo "📦 Building Docker containers..."
docker compose build

echo ""
echo "🔧 Starting services..."
docker compose up -d

echo ""
echo "⏳ Waiting for database to be ready..."
sleep 5

echo ""
echo "📊 Backend handles migrations automatically on startup."

echo ""
echo "ℹ️  Sample data initialization skipped (to avoid dummy data)."

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
echo "   - View logs: docker compose logs -f"
echo "   - Stop services: docker compose down"
echo "   - Restart: docker compose restart"
echo ""
