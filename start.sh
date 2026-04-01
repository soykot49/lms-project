#!/bin/bash

set -e

echo "🚀 Starting Library Management System..."
echo ""

# Run from repository root
cd "$(dirname "$0")"

echo "📦 Building Docker containers..."
docker compose build

echo ""
echo "🔧 Starting services..."
docker compose up -d

echo ""
echo "⏳ Waiting for services..."
sleep 5

echo ""
echo "✅ Library Management System is ready!"
echo ""
echo "📍 URLs:"
echo "   - Frontend: http://localhost:3000"
echo "   - API: http://localhost:8000/api/"
echo "   - Admin: http://localhost:8000/admin/"
echo ""
echo "📝 Useful commands:"
echo "   - View logs: docker compose logs -f"
echo "   - Stop services: docker compose down"
echo "   - Remove volumes: docker compose down -v"
echo ""
