# Docker Troubleshooting

> **TODO**: Consolidate existing Docker troubleshooting docs from root:
> - ../docker-setup.md (moved to getting-started/docker-setup.md)
> - ../docker-troubleshooting.md
> - ../docker-connection-reset-fix.md
> - ../docker-frontend-backend-connection.md
> - ../docker-localhost-vs-zeroconf-fix.md
> - ../docker-localhost-ipv6-ipv4-issue.md
> - ../docker-import-error-fix.md
>
> **Note**: Original troubleshooting files are still in the docs root directory.
> They should be consolidated into this file and then removed.

## Common Docker Issues

### Container Won't Start

> **TODO**: Document container startup issues

### Connection Reset Errors

> **TODO**: Consolidate from docker-connection-reset-fix.md

### Frontend Cannot Reach Backend

> **TODO**: Consolidate from docker-frontend-backend-connection.md

### localhost vs Zeroconf Issues

> **TODO**: Consolidate from docker-localhost-vs-zeroconf-fix.md

### IPv6 vs IPv4 Issues

> **TODO**: Consolidate from docker-localhost-ipv6-ipv4-issue.md

### Import Errors in Containers

> **TODO**: Consolidate from docker-import-error-fix.md

## Docker Commands Reference

```bash
# Start services
./scripts/docker-dev.sh up

# View logs
./scripts/docker-dev.sh logs

# Stop services
./scripts/docker-dev.sh down

# Restart services
./scripts/docker-dev.sh restart

# Open shell in API container
./scripts/docker-dev.sh shell

# Clean volumes
docker-compose down -v
```

## Docker Compose Configuration

> **TODO**: Document docker-compose.yml structure and service configuration
