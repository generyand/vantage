# Frontend Troubleshooting

> **TODO**: Consolidate frontend-specific issues including:
> - ../fix-login-localhost-error.md content (still in docs root)
> - Type generation issues
> - API connection problems
> - Build failures
> - Hot reload not working
> - Component hydration errors
>
> **Note**: Original troubleshooting file is still in the docs root directory.
> It should be consolidated into this file and then removed.

## Common Frontend Issues

### Login Localhost Error

> **TODO**: Consolidate from fix-login-localhost-error.md

### Type Generation Failures

> **TODO**: Document type generation troubleshooting

### API Connection Errors

> **TODO**: Document API client connection issues

### Build Failures

> **TODO**: Document Next.js build troubleshooting

### Hot Reload Not Working

> **TODO**: Document development server issues

### Hydration Errors

> **TODO**: Document React hydration mismatch errors

## Debugging Frontend

```bash
# Run with verbose output
cd apps/web
NEXT_PUBLIC_DEBUG=true pnpm dev

# Check type generation
pnpm generate-types

# Clear Next.js cache
rm -rf .next
pnpm dev

# Check API connectivity
curl http://localhost:8000/api/v1/health
```

## Environment Variables

> **TODO**: Document required frontend environment variables
