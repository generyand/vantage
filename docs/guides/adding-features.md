# Adding Features Guide

> **TODO**: Document the complete feature development workflow including:
> - Planning and design considerations
> - Backend development steps (Model → Schema → Service → Router)
> - Database migration workflow
> - Type generation
> - Frontend development steps
> - Testing requirements
> - Code review checklist
> - Example: Adding a complete feature end-to-end

## Feature Development Workflow

### 1. Planning

> **TODO**: Document planning phase considerations

### 2. Backend Development

#### 2.1. Update Database Models

```python
# apps/api/app/db/models/your_model.py
# TODO: Add example
```

#### 2.2. Create Migration

```bash
cd apps/api
alembic revision --autogenerate -m "add your_feature table"
alembic upgrade head
```

#### 2.3. Define Pydantic Schemas

```python
# apps/api/app/schemas/your_feature.py
# TODO: Add example
```

#### 2.4. Implement Service Layer

```python
# apps/api/app/services/your_feature_service.py
# TODO: Add example following "Fat Services, Thin Routers" pattern
```

#### 2.5. Create API Router

```python
# apps/api/app/api/v1/your_feature.py
# TODO: Add example with proper tags
```

#### 2.6. Register Router

```python
# apps/api/app/api/v1/__init__.py
# TODO: Show how to register new router
```

### 3. Generate Types

```bash
pnpm generate-types
```

### 4. Frontend Development

> **TODO**: Document frontend implementation steps

### 5. Testing

> **TODO**: Document testing requirements

### 6. Documentation

> **TODO**: Document what documentation to update

## Example: Adding a "Notifications" Feature

> **TODO**: Add complete end-to-end example
