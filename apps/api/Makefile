# 🛠️ Vantage API Development Commands
# Simple Makefile for 2-person team efficiency

.PHONY: help dev test lint format clean migrate setup

# Default target
help:
	@echo "🚀 Vantage API Development Commands"
	@echo ""
	@echo "📋 Available commands:"
	@echo "  make setup    - Initial project setup"
	@echo "  make dev      - Start development server"
	@echo "  make test     - Run all tests"
	@echo "  make lint     - Run linting checks"
	@echo "  make format   - Format code with ruff"
	@echo "  make migrate  - Apply database migrations"
	@echo "  make clean    - Clean up generated files"
	@echo ""
	@echo "🔗 Quick access:"
	@echo "  API Docs: http://localhost:8000/docs"
	@echo "  Health:   http://localhost:8000/health"

# Initial setup for new developers
setup:
	@echo "🔧 Setting up development environment..."
	uv sync
	@echo "📝 Please copy .env.example to .env and configure your settings"
	@echo "🗄️ Then run 'make migrate' to set up your database"

# Start development server
dev:
	@echo "🚀 Starting development server..."
	uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Run tests
test:
	@echo "🧪 Running tests..."
	uv run pytest -v --tb=short

# Run tests with coverage
test-cov:
	@echo "🧪 Running tests with coverage..."
	uv run pytest --cov=app --cov-report=term-missing --cov-report=html

# Linting
lint:
	@echo "🔍 Running linting checks..."
	uv run ruff check
	uv run mypy app/

# Format code
format:
	@echo "✨ Formatting code..."
	uv run ruff format
	uv run ruff check --fix

# Database migrations
migrate:
	@echo "🗄️ Applying database migrations..."
	uv run alembic upgrade head

# Create new migration
migration:
	@echo "📝 Creating new migration..."
	@read -p "Migration description: " desc; \
	uv run alembic revision --autogenerate -m "$$desc"

# Clean up
clean:
	@echo "🧹 Cleaning up..."
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true
	rm -f test.db 2>/dev/null || true
	rm -rf htmlcov/ 2>/dev/null || true
	rm -rf .coverage 2>/dev/null || true
	rm -rf .pytest_cache/ 2>/dev/null || true

# All-in-one development check
check: lint test
	@echo "✅ All checks passed!"

# Install new dependency
add:
	@read -p "Package name: " pkg; \
	uv add $$pkg

# Install new dev dependency
add-dev:
	@read -p "Dev package name: " pkg; \
	uv add --dev $$pkg 