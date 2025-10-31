# Backend Architecture

> **TODO**: Document FastAPI backend architecture including:
> - Directory structure explanation
> - Model → Schema → Service → Router pattern
> - Dependency injection with FastAPI Depends
> - Database session management
> - Authentication and authorization flow
> - Error handling strategy
> - Logging configuration
> - Background task architecture (Celery)
> - API versioning strategy
> - Tag-based endpoint organization

## Directory Structure

```
apps/api/
├── app/
│   ├── api/v1/          # API route handlers (thin layer)
│   ├── core/            # Core configuration (settings, security, Celery)
│   ├── db/              # Database models and session management
│   ├── schemas/         # Pydantic models for validation
│   ├── services/        # Business logic (fat layer)
│   └── workers/         # Celery background tasks
├── tests/               # pytest test suite
├── alembic/             # Database migrations
└── alembic.ini          # Alembic configuration
```

## Service Layer Pattern

> **TODO**: Explain the "Fat Services, Thin Routers" pattern with examples

## Database Layer

> **TODO**: Document SQLAlchemy model structure, relationships, and session management

## API Design

> **TODO**: Document REST API conventions, response formats, error codes
