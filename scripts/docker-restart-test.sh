#!/bin/bash
# Script to restart Docker with IPv6 disabled and test localhost connectivity

set -e

echo "🔄 Stopping existing Docker containers..."
docker compose down 2>/dev/null || true

echo ""
echo "🚀 Starting Docker containers with IPv6 disabled..."
docker compose up -d --build

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 5

echo ""
echo "🧪 Testing localhost connectivity..."
echo ""

echo "Test 1: curl http://localhost:8000/health"
if curl -s -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ SUCCESS - localhost works!"
    curl -s http://localhost:8000/health | jq '.' 2>/dev/null || curl -s http://localhost:8000/health
else
    echo "❌ FAILED - localhost still not working"
    echo "Exit code: $?"
fi

echo ""
echo "Test 2: curl http://127.0.0.1:8000/health"
if curl -s -f http://127.0.0.1:8000/health > /dev/null 2>&1; then
    echo "✅ SUCCESS - 127.0.0.1 works!"
else
    echo "❌ FAILED - 127.0.0.1 not working"
fi

echo ""
echo "📊 Container status:"
docker compose ps

echo ""
echo "📝 Check logs with: docker compose logs -f"

