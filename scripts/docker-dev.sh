#!/bin/bash
# Convenience script for Docker development operations

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}VANTAGE Docker Development Helper${NC}\n"

# Function to show usage
usage() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  up          Start all services"
    echo "  down        Stop all services"
    echo "  restart     Restart all services"
    echo "  build       Build all images"
    echo "  logs        Show logs from all services"
    echo "  shell       Open shell in API container"
    echo "  clean       Remove containers, volumes, and images"
    echo "  status      Show status of all services"
    echo "  check-ports Check for port conflicts"
    echo "  kill-ports  Kill processes using Docker ports"
    echo ""
    exit 1
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "Error: Docker Compose is not installed"
    exit 1
fi

# Use docker compose or docker-compose
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

COMMAND=${1:-"up"}

case "$COMMAND" in
    up)
        echo -e "${BLUE}Checking environment files...${NC}"
        
        # Check if API .env exists
        if [ ! -f "apps/api/.env" ]; then
            echo -e "${YELLOW}Warning: apps/api/.env not found${NC}"
            echo -e "Copy apps/api/.env.example to apps/api/.env and configure your Supabase credentials"
            echo ""
        fi
        
        # Check if web .env.local exists
        if [ ! -f "apps/web/.env.local" ]; then
            echo -e "${YELLOW}Warning: apps/web/.env.local not found${NC}"
            echo -e "Creating from apps/web/.env.example..."
            cp apps/web/.env.example apps/web/.env.local 2>/dev/null || true
        fi
        
        echo -e "${GREEN}Starting all services...${NC}\n"
        $DOCKER_COMPOSE -f docker-compose.yml -f docker-compose.dev.yml up -d
        echo -e "\n${GREEN}Services started!${NC}"
        echo -e "API: http://localhost:8000"
        echo -e "Web: http://localhost:3000"
        echo -e "Redis: localhost:6379"
        echo -e "\nTo view logs: $0 logs"
        ;;
    down)
        echo -e "${YELLOW}Stopping all services...${NC}\n"
        $DOCKER_COMPOSE -f docker-compose.yml -f docker-compose.dev.yml down
        echo -e "${GREEN}All services stopped${NC}"
        ;;
    restart)
        echo -e "${YELLOW}Restarting all services...${NC}\n"
        $DOCKER_COMPOSE -f docker-compose.yml -f docker-compose.dev.yml restart
        echo -e "${GREEN}All services restarted${NC}"
        ;;
    build)
        echo -e "${BLUE}Building all images...${NC}\n"
        $DOCKER_COMPOSE -f docker-compose.yml -f docker-compose.dev.yml build --no-cache
        echo -e "${GREEN}All images built${NC}"
        ;;
    logs)
        echo -e "${BLUE}Showing logs from all services...${NC}\n"
        $DOCKER_COMPOSE -f docker-compose.yml -f docker-compose.dev.yml logs -f
        ;;
    shell)
        echo -e "${BLUE}Opening shell in API container...${NC}\n"
        docker exec -it vantage-api /bin/bash
        ;;
    clean)
        echo -e "${YELLOW}Cleaning up containers, volumes, and images...${NC}\n"
        read -p "Are you sure you want to remove all containers, volumes, and images? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            $DOCKER_COMPOSE -f docker-compose.yml -f docker-compose.dev.yml down -v
            docker system prune -a --volumes -f
            echo -e "${GREEN}Cleanup complete${NC}"
        else
            echo "Cleanup cancelled"
        fi
        ;;
    status)
        echo -e "${BLUE}Service Status:${NC}\n"
        $DOCKER_COMPOSE -f docker-compose.yml -f docker-compose.dev.yml ps
        ;;
    check-ports)
        echo -e "${BLUE}Checking for port conflicts...${NC}\n"
        ports=(8000 3000 6379)
        for port in "${ports[@]}"; do
            if lsof -i :$port >/dev/null 2>&1; then
                echo -e "${YELLOW}Port $port is in use:${NC}"
                lsof -i :$port
                echo ""
            else
                echo -e "${GREEN}Port $port is free${NC}"
            fi
        done
        ;;
    kill-ports)
        echo -e "${YELLOW}Warning: This will kill processes using ports 8000, 3000, and 6379${NC}"
        read -p "Are you sure? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${YELLOW}Killing processes...${NC}"
            for port in 8000 3000 6379; do
                pids=$(lsof -ti :$port 2>/dev/null)
                if [ ! -z "$pids" ]; then
                    kill $pids 2>/dev/null && echo "Freed port $port"
                fi
            done
            echo -e "${GREEN}Done${NC}"
        else
            echo "Cancelled"
        fi
        ;;
    *)
        usage
        ;;
esac

