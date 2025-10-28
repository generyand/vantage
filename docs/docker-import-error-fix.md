# ASGI Import Error Fix

## Problem

The API container fails to start with error:

```
ERROR: Error loading ASGI app. Could not import module "app.main".
```

## Root Cause

The issue is that `main.py` is located at the root of `apps/api/` directory, not in `apps/api/app/`.

Structure:

```
apps/api/
├── main.py           # ← This is at the root
├── app/              # ← Application code is in this subdirectory
│   ├── api/
│   ├── core/
│   └── ...
└── pyproject.toml
```

## Solution

The uvicorn command needs to reference `main:app` not `app.main:app` because:

- `main.py` is directly in `/app` (root of the container)
- The FastAPI app object `app` is defined in `main.py`

## Files Changed

### 1. `apps/api/Dockerfile`

Changed the CMD:

```dockerfile
# Before
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# After
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
```

### 2. `docker-compose.dev.yml`

Updated the command for the API service:

```yaml
api:
  command: uvicorn main:app --host 0.0.0.0 --port 8000 --reload --reload-dir /app
```

## Verification

After rebuilding, the container should start successfully:

```bash
# Rebuild and start
./scripts/docker-dev.sh build
./scripts/docker-dev.sh up

# Check logs
./scripts/docker-dev.sh logs

# Or manually
docker logs vantage-api
```

You should see:

```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

## Alternative: Restructure Files

If you prefer to use `app.main:app`, you would need to move `main.py` into the `app/` directory:

```
apps/api/
├── app/
│   ├── main.py      # Move here
│   ├── api/
│   └── ...
└── pyproject.toml
```

But this would require updating all imports in `main.py` which is not recommended.

## Python Path Considerations

The current structure works because:

1. Docker container has `/app` as working directory
2. `main.py` is copied to `/app/main.py` by Dockerfile
3. Python can import `main` directly (no need for `app.main`)
4. The `app` directory is imported from `main.py` as a relative import

The import chain:

- `main.py` imports from `app.*` modules
- These modules are in `/app/app/` directory
- Python finds them because we're at `/app` working directory

## Summary

The fix is simple: change `app.main:app` to `main:app` in:

- Dockerfile CMD
- docker-compose command overrides
- Any other uvicorn invocations in Docker
