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
from app.db.base import check_all_connections

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
    
    # Check database connections
    logger.info("🔍 Checking database connections...")
    db_status = await check_all_connections()
    
    if db_status["overall_status"] == "healthy":
        logger.info("✅ Database connections established successfully!")
        
        # Log individual connection details
        if db_status["database"]["connected"]:
            logger.info(f"  🗄️  PostgreSQL: {db_status['database']['status']}")
        
        if db_status["supabase"]["connected"]:
            logger.info(f"  ⚡ Supabase: {db_status['supabase']['status']}")
            
    else:
        logger.warning("⚠️  Database connection issues detected:")
        
        if not db_status["database"]["connected"]:
            logger.warning(f"  🗄️  PostgreSQL: {db_status['database']['error']}")
            
        if not db_status["supabase"]["connected"]:
            logger.warning(f"  ⚡ Supabase: {db_status['supabase']['error']}")
            
        logger.warning("  📝 Server will start but some features may be unavailable")
    
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
