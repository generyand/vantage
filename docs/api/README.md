# API Documentation

> **TODO**: Document the REST API including:
> - Base URL and versioning
> - Authentication methods
> - Common request/response patterns
> - Error response format
> - Rate limiting (if applicable)
> - CORS configuration
> - API conventions and standards

## Base URL

```
Development: http://localhost:8000
Production: TBD
```

## API Version

Current version: **v1**

All endpoints are prefixed with `/api/v1`

## Interactive Documentation

FastAPI provides auto-generated interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI Spec**: http://localhost:8000/openapi.json

## Authentication

> **TODO**: Document authentication flow:
> - Login endpoint
> - Token-based authentication
> - Token refresh mechanism
> - Protected endpoints
> - Role-based access control

See [Authentication](./authentication.md) for detailed information.

## API Endpoints by Domain

- [Assessments](./endpoints/assessments.md) - Assessment CRUD operations
- [Assessors](./endpoints/assessors.md) - Assessor-specific operations
- [Users](./endpoints/users.md) - User management
- [Barangays](./endpoints/barangays.md) - Barangay/LGU management

## Common Response Format

> **TODO**: Document standard response structure for success and error cases

## Error Handling

> **TODO**: Document error response format and common status codes
