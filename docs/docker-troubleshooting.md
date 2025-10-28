# Docker Troubleshooting Guide

## Network Issues

### "Pool overlaps with other one on this address space"

This error occurs when Docker tries to create a network with an IP range that's already in use by another network.

**Solution:**

1. **Manual cleanup:**

   ```bash
   # List existing networks
   docker network ls

   # Inspect the conflicting network
   docker network inspect <network-name>

   # Remove the conflicting network (WARNING: This will affect other containers)
   docker network rm <network-name>
   ```

2. **Use a different subnet:** (Already applied in current configuration)
   The network configuration now uses:

   - IPv4: `172.25.0.0/16` (was 172.20.0.0/16)
   - IPv6: `fd01::/64` (was fd00::/64)

   If you still encounter this issue, you can further modify `docker-compose.yml`:

   ```yaml
   networks:
     vantage-network:
       driver: bridge
       enable_ipv6: true
       ipam:
         driver: default
         config:
           - subnet: 172.26.0.0/16 # Change this
             gateway: 172.26.0.1
           - subnet: fd02::/64 # Change this
             gateway: fd02::1
   ```

3. **Disable IPv6 (simpler but less future-proof):**
   ```yaml
   networks:
     vantage-network:
       driver: bridge
       ipam:
         driver: default
         config:
           - subnet: 172.25.0.0/16
             gateway: 172.25.0.1
   ```

### "Permission denied while trying to connect to the Docker daemon socket"

**Solution:**

```bash
# Option 1: Use sudo
sudo docker-compose up

# Option 2: Add user to docker group (permanent fix)
sudo usermod -aG docker $USER

# Then logout and login again, or run:
newgrp docker
```

## Build Issues

### "uv.lock: not found"

**Cause:** The Docker build context was incorrect.

**Solution:** Fixed in current configuration. The build context is now:

- API: `apps/api`
- Web: root directory (`.`)

### "ModuleNotFoundError" in containers

**Solution:** Ensure volumes are mounted correctly:

```yaml
volumes:
  - ./apps/api:/app # API code
  - ./packages/shared:/packages/shared # Shared types
```

## Environment Variable Issues

### "DATABASE_URL variable is not set"

**Solution:**

1. Ensure `apps/api/.env` exists with your Supabase credentials
2. Verify the file is in the correct location
3. Check that variables are not commented out:

   ```env
   # ❌ Wrong - commented out
   # DATABASE_URL=postgresql://...

   # ✅ Correct
   DATABASE_URL=postgresql://...
   ```

### Environment variables not loading in containers

**Solution:**

1. Check the `env_file` directive in docker-compose.yml is pointing to correct file
2. Restart containers after changing .env file:
   ```bash
   ./scripts/docker-dev.sh restart
   ```

## Container Startup Issues

### API container failing health check

**Solution:**

```bash
# Check API logs
docker logs vantage-api

# Common causes:
# - Database connection failed (check DATABASE_URL in apps/api/.env)
# - Redis connection failed (should auto-connect to redis service)
# - Missing dependencies (rebuild: docker-compose build --no-cache)
```

### Celery worker not starting

**Solution:**

```bash
# Check if Redis is healthy
docker ps | grep redis

# Check Celery logs
docker logs vantage-celery-worker

# Verify Celery configuration
docker exec vantage-api python -c "from app.core.celery_app import celery_app; print(celery_app.conf.broker_url)"
```

## Performance Issues

### Slow file watching in Docker

**Solution:** Already configured with `WATCHPACK_POLLING=true` in web service. For additional optimization:

```yaml
environment:
  - CHOKIDAR_USEPOLLING=true # For Linux
  - WATCHPACK_POLLING=true # For Next.js
```

### High Docker Desktop resource usage

**Solution:**

1. Limit Docker Desktop resources in settings
2. Use Docker's BuildKit for faster builds:
   ```bash
   export DOCKER_BUILDKIT=1
   docker-compose build
   ```

## Debugging Commands

### Check container status

```bash
docker ps -a
docker-compose ps
```

### View logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f web
docker-compose logs -f celery-worker
```

### Execute commands in containers

```bash
# Shell into API container
docker exec -it vantage-api bash

# Shell into web container
docker exec -it vantage-web sh

# Run Python command in API
docker exec vantage-api python -c "from app.core.config import settings; print(settings.SUPABASE_URL)"

# Run Node command in web
docker exec vantage-web node --version
```

### Check network connectivity

```bash
# Test connectivity between containers
docker exec vantage-api ping redis

# Check DNS resolution
docker exec vantage-api nslookup redis

# List Docker networks
docker network ls
docker network inspect vantage_vantage-network
```

### Clean up everything

```bash
# Stop and remove containers, networks
docker-compose down

# Remove volumes too (WARNING: deletes data)
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Complete cleanup
docker system prune -a --volumes
```

### Port already in use

**Error:** `address already in use` or `bind: address already in use`

**Common causes:**

- Running local development server (uvicorn, next dev) on the same ports
- Another Docker container using the port
- System service using the port

**Solution:**

1. **Check what's using the port:**

   ```bash
   # Check specific port
   lsof -i :8000
   lsof -i :3000
   # or
   netstat -tlnp | grep 8000
   ```

2. **Use the helper script:**

   ```bash
   ./scripts/docker-dev.sh check-ports
   ```

3. **Kill processes using Docker ports:**

   ```bash
   # Automated kill (interactive confirmation)
   ./scripts/docker-dev.sh kill-ports

   # Manual kill
   kill $(lsof -ti :8000)  # Kill process on port 8000
   kill $(lsof -ti :3000)  # Kill process on port 3000
   kill $(lsof -ti :6379)  # Kill process on port 6379

   # Or use pkill for development servers
   pkill -f "next dev"      # Kill Next.js dev server
   pkill -f "uvicorn"        # Kill uvicorn server
   ```

4. **Or change Docker port mapping:**
   ```yaml
   ports:
     - "8001:8000" # Use 8001 instead of 8000
     - "3001:3000" # Use 3001 instead of 3000
   ```

## Common Fixes Summary

| Issue                        | Quick Fix                                           |
| ---------------------------- | --------------------------------------------------- |
| Network overlaps             | Change subnet in docker-compose.yml                 |
| Permission denied            | Run with `sudo` or add user to docker group         |
| Build fails                  | `docker-compose build --no-cache`                   |
| Env vars missing             | Check apps/api/.env and apps/web/.env.local         |
| Containers not communicating | Check depends_on and healthcheck                    |
| Port already in use          | `./scripts/docker-dev.sh kill-ports` or change port |
| Out of disk space            | `docker system prune -a`                            |

## Getting Help

If issues persist:

1. Check logs: `./scripts/docker-dev.sh logs`
2. Verify environment files exist and are configured
3. Try rebuilding: `./scripts/docker-dev.sh build`
4. Check Docker Desktop/system resources
5. Review configuration in `docker-compose.yml` and `apps/api/.env`
