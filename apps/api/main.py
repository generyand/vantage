# 🚀 VANTAGE API Main Application
# FastAPI application entry point with configuration and middleware setup

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
from datetime import datetime

# Import from our restructured modules
from app.core.config import settings
from app.api.v1 import api_router as api_router_v1
from app.db.base import check_all_connections, validate_connections_startup

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan context manager.
    
    Handles startup and shutdown events.
    """
    # Startup
    logger.info("🚀 Starting VANTAGE API server...")
    logger.info(f"📊 Environment: {settings.ENVIRONMENT}")
    logger.info(f"🔧 Debug mode: {settings.DEBUG}")
    
    # Check and validate database connections on startup
    logger.info("🔍 Checking database connections...")
    
    connection_requirement = "all" if settings.REQUIRE_ALL_CONNECTIONS else "at least one"
    logger.info(f"🔐 Connection requirement: {connection_requirement} connection(s) must be healthy")
    
    try:
        # This will throw an exception if connections fail according to requirements
        await validate_connections_startup(require_all=settings.REQUIRE_ALL_CONNECTIONS)
        logger.info("✅ Database connection requirements satisfied!")
        
        # Get detailed status for logging
        connection_details = await check_all_connections()
        
        # Log individual connection details
        if connection_details["database"]["connected"]:
            logger.info(f"  🗄️  PostgreSQL: healthy")
        else:
            logger.warning(f"  🗄️  PostgreSQL: not connected (some features may be unavailable)")
        
        if connection_details["supabase"]["connected"]:
            logger.info(f"  ⚡ Supabase: healthy")
        else:
            logger.warning(f"  ⚡ Supabase: not connected (some features may be unavailable)")
    except Exception as e:
        logger.critical(f"❌ Failed to establish required connections: {str(e)}")
        # Re-raise the exception to prevent server startup
        raise
    
    logger.info("🎯 VANTAGE API server startup complete!")
    
    # Application is running
    yield
    
    # Shutdown
    logger.info("🛑 Shutting down VANTAGE API server...")
    logger.info("👋 Goodbye!")


# Create the FastAPI application with lifespan
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Configure CORS middleware using settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the V1 API router
# All routes from auth.py, users.py, etc., will be available under the /api/v1 prefix
app.include_router(api_router_v1, prefix="/api/v1")


# Local development server (optional)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
