# Vantage API (FastAPI Backend)

Backend API service for the Vantage application built with **FastAPI** and **Python 3.13**.

## 🚀 **Quick Start**

```bash
# From monorepo root
pnpm dev:api

# Or from this directory
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## 📋 **Available Commands**

### **Development**
```bash
# Start development server with hot reload
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Start via monorepo (recommended)
pnpm dev:api
```

### **Testing**
```bash
# Run all tests
uv run pytest

# Run tests with coverage
uv run pytest --cov=app --cov-report=html

# Run specific test file
uv run pytest tests/test_auth.py

# Run tests with verbose output
uv run pytest -v
```

### **Linting & Formatting**
```bash
# Run linting
uv run ruff check

# Auto-fix linting issues
uv run ruff check --fix

# Format code
uv run ruff format

# Type checking
uv run mypy app/
```

### **Database Operations**
```bash
# Apply database migrations (when implemented)
# uv run alembic upgrade head

# Create new migration (when implemented)
# uv run alembic revision --autogenerate -m "description"

# Reset database (when implemented)
# uv run alembic downgrade base
```

### **Dependencies**
```bash
# Add new dependency
uv add package-name

# Add development dependency
uv add --dev package-name

# Update dependencies
uv sync

# Show dependency tree
uv tree
```

## 🛠️ **Development Tools**

### **API Documentation**
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`
- **OpenAPI JSON**: `http://localhost:8000/openapi.json`

### **Health Checks**
- **Health**: `GET /health`
- **Root**: `GET /`

## 🏗️ **Project Structure**

```
apps/api/
├── app/                    # Main application package
│   ├── models/            # Pydantic data models
│   ├── api/               # API route handlers
│   ├── core/              # Core configurations
│   ├── services/          # Business logic services
│   └── schemas/           # API request/response schemas
├── tests/                 # Test files
├── main.py               # FastAPI application entry point
├── pyproject.toml        # Python project configuration
└── uv.lock              # Dependency lockfile
```

## 🔗 **API Endpoints**

| Method | Endpoint | Description | Tag |
|--------|----------|-------------|-----|
| `GET` | `/` | Welcome message | system |
| `GET` | `/health` | Health check | system |
| `GET` | `/api/hello` | Hello world | system |
| `POST` | `/api/auth/login` | User login | auth |
| `POST` | `/api/auth/logout` | User logout | auth |
| `GET` | `/api/users/me` | Get current user | users |
| `GET` | `/api/projects` | List projects | projects |

## 🏷️ **Endpoint Tags**

Endpoints are organized by feature areas using FastAPI tags:

- **auth**: Authentication and authorization
- **users**: User management and profiles  
- **projects**: Project CRUD operations
- **system**: Health checks and system information

These tags are used for generating organized TypeScript types.

## 🔧 **Environment Variables**

Create a `.env` file (copy from `.env.example` when available):

```bash
# Development settings
DEBUG=true
ENVIRONMENT=development

# Database (when implemented)
# DATABASE_URL=postgresql://user:password@localhost/vantage

# Security (when implemented)
# SECRET_KEY=your-secret-key-here
# ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## 🧪 **Testing Guidelines**

- Place tests in `tests/` directory
- Use `pytest` for test runner
- Follow naming convention: `test_*.py`
- Test files should mirror app structure
- Include both unit and integration tests

Example test structure:
```
tests/
├── conftest.py          # Shared fixtures
├── test_auth.py         # Authentication tests
├── test_users.py        # User management tests
└── test_projects.py     # Project tests
```

## 📝 **Code Style**

- **Linting**: `ruff` (configured in `pyproject.toml`)
- **Formatting**: `ruff format`
- **Type Checking**: `mypy`
- **Import Sorting**: Handled by `ruff`

## 🚀 **Deployment Notes**

*To be documented when deployment pipeline is implemented*

## 🔗 **Related Documentation**

- [Root README](../../README.md) - Overall project setup
- [Web App README](../web/README.md) - Frontend documentation
- [Architecture Docs](../../docs/architecture.md) - System design
- [Decision Records](../../docs/decisions.md) - Technical decisions
