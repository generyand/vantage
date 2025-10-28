# Docker Frontend-Backend Connection Issue

## Problem

When running the application in Docker, the frontend cannot fetch data from the backend, even though it works fine when running manually.

## Root Cause

Next.js has two runtime environments:

1. **Server-side (SSR)**: Runs inside the Docker container
2. **Client-side (Browser)**: Runs on the user's machine

### The Issue:

- `NEXT_PUBLIC_*` environment variables are **only** available in the browser
- On the server side (SSR), they are `undefined`
- The code was falling back to `http://localhost:8000`, which from inside Docker refers to the Next.js container itself, not the API container

### When Running Manually:

- Both frontend and backend are on the host machine
- Both use `localhost:8000` and it works fine

### When Running in Docker:

- Server-side requests from Next.js container → Need `http://api:8000` (internal Docker network)
- Client-side requests from browser → Need `http://localhost:8000` (exposed port)
- Previously, server-side was trying to use `http://localhost:8000` which failed!

## Solution

### 1. Updated `apps/web/src/lib/api.ts`

```typescript
const getBaseURL = () => {
  const isServer = typeof window === "undefined";

  // Server-side (Next.js SSR/API Routes running in Docker)
  if (isServer) {
    // In Docker, use the internal service name
    // In local dev (not in Docker), use localhost
    return process.env.API_BASE_URL || "http://api:8000";
  }

  // Client-side (browser) - use the public environment variable
  // This is exposed by NEXT_PUBLIC_ prefix and accessible to the browser
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
};
```

### 2. Added Server-Side Environment Variable to `docker-compose.yml`

```yaml
web:
  environment:
    # Server-side API URL (for SSR in Docker, uses internal network)
    - API_BASE_URL=http://api:8000
```

### 3. Kept Client-Side Environment Variable in `.env.local`

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_APP_ENV=development
```

## How It Works Now

### In Docker:

1. **Client-Side (Browser) Requests**:

   - Use `NEXT_PUBLIC_API_BASE_URL` = `http://localhost:8000`
   - Browser → Host machine's exposed port → API container ✅

2. **Server-Side (SSR/API Routes) Requests**:
   - Use `API_BASE_URL` = `http://api:8000`
   - Next.js container → Internal Docker network → API container ✅

### Not in Docker (Local Development):

1. **Client-Side**: Uses `http://localhost:8000` ✅
2. **Server-Side**: Uses `http://localhost:8000` (not Docker, so localhost works) ✅

## Additional Changes

### CORS Configuration

Updated `apps/api/app/core/config.py` to allow Docker internal network access:

```python
BACKEND_CORS_ORIGINS: List[str] = [
    "http://localhost:3000",
    "http://localhost:3001",
    # Docker internal network access
    "http://vantage-web:3000",
    "http://172.25.0.40:3000",
]
```

## Testing

After making these changes, rebuild and restart Docker:

```bash
docker-compose down
docker-compose up -d --build
```

### Verify:

1. Check that both containers are running:

   ```bash
   docker ps
   ```

2. Check frontend logs:

   ```bash
   docker logs vantage-web -f
   ```

3. Check backend logs:

   ```bash
   docker logs vantage-api -f
   ```

4. Open browser console and check network requests:

   - Should be calling `http://localhost:8000`
   - Should get successful responses

5. Test a page that uses SSR:
   - Server-side: Should use `http://api:8000`
   - Client-side: Should use `http://localhost:8000`

## Key Takeaway

The difference between `NEXT_PUBLIC_*` (client) and regular env vars (server) in Next.js, combined with Docker's network isolation, requires different URLs for:

- **Browser requests** (client-side): Use host-accessible URL (`localhost:8000`)
- **Server requests** (SSR): Use internal Docker service name (`api:8000`)
