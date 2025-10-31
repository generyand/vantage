# Type Generation Workflow

> **TODO**: Document the complete type generation workflow including:
> - Why type generation is critical
> - How Orval works with FastAPI OpenAPI spec
> - Tag-based code organization
> - Generated file structure in packages/shared
> - When to run `pnpm generate-types`
> - Troubleshooting type generation issues
> - Custom type overrides (if any)

## The Type Generation Flow

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant API as FastAPI Backend
    participant Orval as Orval CLI
    participant Shared as packages/shared
    participant Web as Next.js Frontend

    Dev->>API: 1. Define Pydantic schemas
    Dev->>API: 2. Tag endpoints by domain
    API->>API: 3. Generate OpenAPI spec
    Dev->>Orval: 4. Run pnpm generate-types
    Orval->>API: 5. Fetch /openapi.json
    Orval->>Shared: 6. Generate TypeScript types
    Orval->>Shared: 7. Generate React Query hooks
    Web->>Shared: 8. Import types & hooks
```

## Generated Code Structure

> **TODO**: Document the structure of generated files in `packages/shared/src/generated/`

## Configuration

> **TODO**: Document orval.config.ts configuration options

## Best Practices

> **TODO**: Document best practices:
> - Always run after backend schema changes
> - Commit generated types to Git
> - Handle breaking changes
> - Custom hook wrappers
