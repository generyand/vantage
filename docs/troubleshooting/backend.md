# Backend Troubleshooting

> **TODO**: Consolidate backend-specific issues including:
> - ../backend-port-8000-troubleshooting.md content (still in docs root)
> - Python import errors
> - Database connection issues
> - Migration conflicts
> - Celery worker issues
> - Environment variable problems
> - Pydantic validation errors
>
> **Note**: Original troubleshooting file is still in the docs root directory.
> It should be consolidated into this file and then removed.

## Common Backend Issues

### Port 8000 Already in Use

> **TODO**: Consolidate from backend-port-8000-troubleshooting.md

### Database Connection Errors

> **TODO**: Document database connection troubleshooting

### Migration Conflicts

> **TODO**: Document Alembic migration conflict resolution

### Celery Worker Not Processing Tasks

> **TODO**: Document Celery troubleshooting

### Import Errors

> **TODO**: Document Python import resolution

### Pydantic Validation Errors

> **TODO**: Document schema validation troubleshooting

## Debugging Backend

```bash
# Run with debug logging
cd apps/api
DEBUG=true uvicorn app.main:app --reload --log-level=debug

# Check database connection
python -c "from app.db.session import SessionLocal; db = SessionLocal(); print('Connected!')"

# Test Celery connection
celery -A app.core.celery_app inspect ping
```

## Environment Variables

> **TODO**: Document required environment variables and validation
