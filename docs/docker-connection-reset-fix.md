# Docker ERR_CONNECTION_RESET Fix

## Problem

You're getting `ERR_CONNECTION_RESET` error when trying to access the API from the frontend in Docker.

## Root Cause

The API container was **crashing during startup** because:

1. Supabase credentials were not fully configured or were invalid
2. The startup service was trying to connect to Supabase and failing
3. When startup checks failed, the entire server crashed with an exception
4. Since the server never started, the connection was being reset

## Solution

I made the API more resilient to connection failures:

### 1. **Updated `apps/api/main.py`**

Made startup checks non-blocking so the server can start even if connections fail:

```python
async def lifespan(app: FastAPI):
    try:
        await startup_service.perform_startup_checks()
    except Exception as e:
        # Log error but allow server to start anyway
        logger.warning(f"⚠️ Startup checks failed but continuing: {str(e)}")
        logger.warning("⚠️ Some features may be unavailable")
```

### 2. **Updated `apps/api/app/db/base.py`**

Made Supabase client initialization resilient:

- Added try-catch blocks around Supabase client creation
- Return None if initialization fails (instead of crashing)
- Added RuntimeError when trying to use unconfigured Supabase client

This allows the API to start even without Supabase credentials.

## How to Fix Your Setup

### Option 1: Provide Supabase Credentials (Recommended)

Create/update `apps/api/.env` with proper Supabase credentials:

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database Connection
DATABASE_URL=postgresql://postgres:[password]@db.your-project.supabase.co:5432/postgres

# Other settings...
SECRET_KEY=your-secret-key
ALGORITHM=HS256
```

### Option 2: Disable Connection Requirements

If you're just testing and don't have Supabase set up yet, update your `.env`:

```bash
# Allow server to start with partial connections
REQUIRE_ALL_CONNECTIONS=false
```

### Option 3: Skip Supabase Entirely (Development Only)

For local development without Supabase:

1. Comment out Supabase-related features
2. Use a local PostgreSQL database
3. Or use SQLite for testing

## Rebuild and Test

After making these changes:

```bash
# Stop containers
docker-compose down

# Rebuild with new code
docker-compose up -d --build

# Check logs
docker logs vantage-api -f
docker logs vantage-web -f
```

You should see the API server start successfully, even if there are warnings about Supabase connections.

## Verify It's Working

1. Check API health: `http://localhost:8000/health`
2. Check API docs: `http://localhost:8000/docs`
3. Try frontend: `http://localhost:3000`

The connection should no longer be reset.
