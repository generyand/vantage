# Backend Port 8000 Troubleshooting

## Problem: Connection Reset Error

When running the backend with `pnpm dev:api`, you get:

```
ERROR:    [Errno 98] Address already in use
```

When trying to connect from the frontend to `http://localhost:8000`, you get:

```
Connection reset by peer
```

## Root Cause

Port 8000 is occupied by a **zombie process** (either from a previous Docker container or test run that didn't shut down properly). This process isn't serving the FastAPI app correctly.

## Diagnosis Steps

### 1. Check what's listening on port 8000

```bash
# Check if port 8000 is listening
ss -tlnp | grep 8000

# Check for uvicorn processes
ps aux | grep uvicorn

# Check for Python processes on port 8000
ps aux | grep "python.*8000"
```

### 2. Identify the process

Look for output like:

```
root      481718  ...  /usr/local/bin/python /usr/local/bin/uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Check if it's from Docker

```bash
# Check Docker containers
docker ps -a | grep vantage-api

# Check Docker logs
docker logs vantage-api

# Stop all Docker containers
docker compose down
```

## Solutions

### Solution 1: Kill the Zombie Process

**If you can identify the process:**

```bash
# Find the process ID
PID=$(pgrep -f "uvicorn.*8000" | head -1)

# Kill it (may require sudo)
kill $PID

# If that doesn't work:
sudo kill -9 $PID
```

**If you need sudo and it's asking for password:**

Run this in a separate terminal where you CAN use sudo, then try:

```bash
sudo kill -9 <PID>
```

### Solution 2: Use a Different Port

Temporarily change the port to bypass the issue:

1. Edit `apps/api/main.py` (line 83):

```python
uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)  # Changed to 8001
```

2. Edit `apps/web/.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8001
```

3. Update docker-compose files if using Docker.

### Solution 3: Restart Services Properly

1. **Stop everything:**

```bash
# Stop your dev server (Ctrl+C)
# Kill any Docker containers
docker compose down
docker compose -f docker-compose.yml -f docker-compose.dev.yml down

# Kill any remaining processes
pkill -f uvicorn
pkill -f "python.*main:app"
```

2. **Start fresh:**

```bash
# From project root
pnpm dev:api
```

## How to Avoid This in the Future

### 1. Always Stop Services Gracefully

- Use `Ctrl+C` to stop uvicorn
- Always run `docker compose down` to stop containers
- Don't force-kill processes unless necessary

### 2. Use Process Management

Consider using a process manager like `supervisord` or `pm2` to manage backend processes.

### 3. Check for Zombies Before Starting

```bash
# Check if port 8000 is free before starting
if lsof -i :8000 > /dev/null 2>&1; then
  echo "Port 8000 is in use. Kill the process first."
  exit 1
fi
```

## Testing if the Backend is Working

Once you've killed the zombie process and restarted, test with:

```bash
# Health check
curl http://localhost:8000/health

# Should return JSON like:
# {"status": "healthy", "overall_status": "healthy", ...}

# Try the users endpoint
curl http://localhost:8000/api/v1/users/me

# Should return 401 (unauthorized) which is expected without auth token
```

## Debugging Network Issues

If frontend still can't reach backend:

1. **Check CORS settings** in `apps/api/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

2. **Verify environment variables** in `apps/web/.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

3. **Check browser console** for specific error messages.

4. **Use browser DevTools Network tab** to see what requests are being made.

## Quick Fix Command

Run this command to kill any process on port 8000 (requires password):

```bash
sudo fuser -k 8000/tcp
```

Or more gently:

```bash
# Find PID
PID=$(netstat -tlnp 2>/dev/null | grep :8000 | awk '{print $7}' | cut -d'/' -f1 | head -1)
# Kill it
if [ ! -z "$PID" ]; then sudo kill $PID; fi
```
