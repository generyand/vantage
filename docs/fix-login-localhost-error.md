# Fix Login Error: ERR_FAILED 500

## Problem

When trying to login from the browser, you get:

```
POST http://localhost:8000/api/v1/auth/login net::ERR_FAILED 500 (Internal Server Error)
AxiosError: Network Error
```

However, `curl http://localhost:8000/health` works fine from the terminal.

## Solution

### Step 1: Update Environment Variable

The `.env.local` file currently has:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

Change it to use `localhost`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

**File: `apps/web/.env.local`**

Edit this file and change line 2 from:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

To:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### Step 2: Restart Next.js Dev Server

After changing the environment variable, restart your frontend:

```bash
# If using pnpm dev:web
# Press Ctrl+C to stop, then:
pnpm dev:web

# Or if using npm
npm run dev
```

## Why This Works

The system now resolves `localhost` to `127.0.0.1` (IPv4) thanks to the Docker IPv6 configuration changes we made earlier.

## Verification

After restarting the frontend:

1. Open browser console
2. Try to login
3. Check the Network tab - the request should now succeed

You should see successful login responses instead of `ERR_FAILED` errors.

## Alternative: If localhost Still Doesn't Work

If `localhost` still doesn't work after this fix, you can temporarily use `127.0.0.1`:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

But the `localhost` solution is preferred.
