# Docker: localhost vs 0.0.0.0 Issue Fix

## Problem

You're seeing errors like "cannot access localhost, only 0.0.0.0" when running in Docker. This happens because:

1. `localhost` from **inside** a Docker container refers to the container itself, not the host machine
2. `0.0.0.0` is a **binding address** (what the server binds to), not an **access address** (what clients connect to)
3. Browsers cannot connect to `http://0.0.0.0:8000` - it's not a valid target

## The Solution

### Fix 1: Updated `.env.local`

Changed from:

```bash
NEXT_PUBLIC_API_BASE_URL=http://0.0.0.0:8000  # ❌ Wrong - browsers can't connect to 0.0.0.0
```

Changed to:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000  # ✅ Correct - browser on host can access this
```

### Fix 2: Dynamic Base URL in `api.ts`

Updated the axios instance to set the base URL **dynamically** on each request:

```typescript
const getBaseURL = () => {
  const isServer = typeof window === "undefined";

  // Server-side (SSR inside Docker container)
  if (isServer) {
    // Use internal Docker service name
    return process.env.API_BASE_URL || "http://api:8000";
  }

  // Client-side (browser on host machine)
  // Browser needs localhost because it's NOT inside Docker
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
};

// Set base URL dynamically for EACH request
axiosInstance.interceptors.request.use((config) => {
  config.baseURL = getBaseURL(); // Resolves correctly for server vs browser
  // ... rest of interceptor
});
```

## How It Works Now

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Host Machine (Your Computer)                                │
│                                                              │
│  ┌──────────────────────┐      ┌──────────────────────┐   │
│  │ Browser              │      │ Docker Container    │   │
│  │ (Client-side)        │      │ (Server-side SSR)   │   │
│  │                      │      │                      │   │
│  │ Uses localhost:8000  │◄─────┤ Uses api:8000        │   │
│  │ ↓                    │      │ ↓                    │   │
│  │ Exposed Port         │      │ Internal Network    │   │
│  └──────────┬───────────┘      └──────────┬───────────┘   │
│             │                              │               │
│             └──────────┬───────────────────┘               │
│                        ▼                                   │
│              ┌──────────────────┐                         │
│              │  API Container   │                         │
│              │  (api:8000)      │                         │
│              │  Bound to:       │                         │
│              │  0.0.0.0:8000    │                         │
│              │  (listens on     │                         │
│              │   all networks)  │                         │
│              └──────────────────┘                         │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow

1. **Browser Request** (Client-side):

   - Origin: Browser on your machine
   - Destination: `http://localhost:8000`
   - Routes through: Host's port mapping → Docker's exposed port → API container
   - ✅ Works!

2. **SSR Request** (Server-side, Next.js):
   - Origin: Next.js container (vantage-web)
   - Destination: `http://api:8000` (Docker internal network name)
   - Routes through: Docker internal network → API container
   - ✅ Works!

## Key Points

- `0.0.0.0` is for **binding** (telling the server to listen on all interfaces)
- `localhost` is for **accessing** from the browser (which runs on the host, not in Docker)
- `api` is the Docker service name (only works inside the Docker network)
- The base URL is determined **dynamically** on each request (not static)

## Testing

After applying these changes:

```bash
# Rebuild
docker-compose down
docker-compose up -d --build

# Check logs
docker logs vantage-web -f
docker logs vantage-api -f

# Test API directly
curl http://localhost:8000/health
```

The connection should work from both:

- The browser (using `localhost:8000`)
- The Next.js server (using `api:8000`)
