# Docker localhost IPv6 vs IPv4 Issue

## Problem

When running the application via Docker, you observe these inconsistencies:

- `curl http://localhost:8000/health` → **No return** (hangs or connection reset)
- `curl http://127.0.0.1:8000/health` → **Returns healthy** ✅
- `curl http://0.0.0.0:8000/health` → **Returns healthy** ✅

## Root Cause

Your system prefers IPv6 over IPv4 for `localhost` resolution:

```bash
$ getent hosts localhost
::1             localhost
```

When curl or your browser connects to `localhost:8000`, it:

1. Resolves `localhost` to IPv6 `::1`
2. Tries to connect to `::1:8000`
3. Docker's port forwarding (`8000:8000`) may not be properly forwarding IPv6 traffic

## Diagnosis

### Check what localhost resolves to:

```bash
getent hosts localhost
```

Expected: Should show both `127.0.0.1` and `::1`

### Check what's listening on port 8000:

```bash
ss -tlnp | grep 8000
```

Expected output shows both IPv4 and IPv6:

```
LISTEN 0 4096 0.0.0.0:8000    0.0.0.0:*
LISTEN 0 4096    [::]:8000       [::]:*
```

### Test IPv6 vs IPv4 explicitly:

```bash
# Force IPv6 (may fail)
curl -6 http://localhost:8000/health

# Force IPv4 (should work)
curl -4 http://localhost:8000/health
```

## Solutions

### Solution 1: Use 127.0.0.1 explicitly (Quick Fix)

Update your frontend environment variable to use `127.0.0.1` instead of `localhost`:

**File: `apps/web/.env.local`**

```env
# Change from:
# NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# To:
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

**Pros:**

- Immediate fix, no Docker config changes needed
- Works reliably

**Cons:**

- Not portable (other developers' systems may not have this issue)
- Explicit IPv4 isn't ideal for future compatibility

### Solution 2: Fix localhost IPv4 resolution (Preferred)

Add IPv4 resolution for localhost in `/etc/hosts`:

```bash
# Check current content
cat /etc/hosts

# Add IPv4 resolution if missing (run with sudo)
sudo nano /etc/hosts
```

Add this line if it's missing:

```
127.0.0.1    localhost
```

Then verify:

```bash
getent hosts localhost
# Should now show: 127.0.0.1 localhost
```

Restart your network service or reboot:

```bash
sudo systemctl restart systemd-resolved
# or just reboot
```

### Solution 3: Configure Docker for proper IPv6 handling (Most Robust)

Update `docker-compose.yml` to ensure IPv6 port mapping works correctly:

**Current configuration** (line 31):

```yaml
ports:
  - "8000:8000"
```

**Better configuration** - explicitly bind both IPv4 and IPv6:

```yaml
ports:
  - "127.0.0.1:8000:8000" # IPv4 only
```

Or enable IPv6 explicitly:

```yaml
ports:
  - "8000:8000"
  - "[::]:8000:8000/tcp" # Explicit IPv6 binding
```

**Note:** The second option requires Docker to properly support IPv6 binding, which may need additional system configuration.

### Solution 4: Disable IPv6 for Docker (Not Recommended)

Only use if other solutions don't work:

**File: `docker-compose.yml`**

```yaml
networks:
  vantage-network:
    driver: bridge
    enable_ipv6: false # Change from true
    ipam:
      driver: default
      config:
        - subnet: 172.25.0.0/16
          gateway: 172.25.0.1
        # Remove IPv6 subnet configuration
```

Then restart Docker:

```bash
docker compose down
docker compose up -d
```

## Verification

After applying any solution, test with:

```bash
# Should work now
curl http://localhost:8000/health

# Force IPv6 - should work (or at least not hang)
curl -6 http://localhost:8000/health

# Force IPv4 - should always work
curl -4 http://localhost:8000/health
```

## Frontend Integration

The frontend in `apps/web/src/lib/api.ts` already handles this properly:

```typescript
const getBaseURL = () => {
  const isServer = typeof window === "undefined";

  // Server-side (Docker internal network)
  if (isServer) {
    return process.env.API_BASE_URL || "http://api:8000";
  }

  // Client-side (browser) - uses localhost
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
};
```

The environment variable `NEXT_PUBLIC_API_BASE_URL` controls what URL the browser uses.

## Recommended Approach

For this specific issue, we have disabled IPv6 in the Docker network configuration:

**File: `docker-compose.yml`**

```yaml
networks:
  vantage-network:
    driver: bridge
    enable_ipv6: false # IPv6 disabled
    ipam:
      driver: default
      config:
        - subnet: 172.25.0.0/16
          gateway: 172.25.0.1
```

**To test this fix:**

```bash
./scripts/docker-restart-test.sh
```

This will:

1. Stop existing containers
2. Restart with IPv6 disabled
3. Test if `localhost:8000` now works
4. Show container status

**Alternative: Quick fix without Docker restart**

1. **Immediate fix**: Fix system DNS resolution:
   ```bash
   sudo bash -c 'echo "127.0.0.1    localhost" >> /etc/hosts'
   sudo systemctl restart systemd-resolved
   ```
2. **Environment fix**: Ensure `apps/web/.env.local` uses `127.0.0.1:8000`

This ensures your application works properly both inside and outside Docker.
