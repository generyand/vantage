"""
🚀 Startup Service
Handles application startup checks and initialization
"""

import logging
from typing import Dict, Any
from datetime import datetime

from app.core.config import settings
from app.db.base import check_all_connections, validate_connections_startup

logger = logging.getLogger(__name__)


class StartupService:
    """
    Service responsible for handling application startup procedures.
    
    This service encapsulates all startup-related logic including:
    - Database connection validation
    - Health checks
    - Startup logging
    - Environment validation
    """
    
    def __init__(self):
        self.startup_time = None
    
    async def perform_startup_checks(self) -> None:
        """
        Execute all required startup checks and validations.
        
        Raises:
            RuntimeError: If critical startup requirements are not met
        """
        self.startup_time = datetime.now()
        
        # Log startup initiation
        self._log_startup_info()
        
        # Validate database connections
        await self._validate_database_connections()
        
        # Log detailed connection status
        await self._log_connection_details()
        
        # Log successful startup
        self._log_startup_success()
    
    def _log_startup_info(self) -> None:
        """Log basic startup information"""
        logger.info("🚀 Starting VANTAGE API server...")
        logger.info(f"📊 Environment: {settings.ENVIRONMENT}")
        logger.info(f"🔧 Debug mode: {settings.DEBUG}")
        logger.info(f"📝 Project: {settings.PROJECT_NAME} v{settings.VERSION}")
    
    async def _validate_database_connections(self) -> None:
        """
        Validate database connections according to configuration requirements.
        
        Raises:
            RuntimeError: If connection requirements are not satisfied
        """
        logger.info("🔍 Checking database connections...")
        
        connection_requirement = "all" if settings.REQUIRE_ALL_CONNECTIONS else "at least one"
        logger.info(f"🔐 Connection requirement: {connection_requirement} connection(s) must be healthy")
        
        try:
            # This will throw an exception if connections fail according to requirements
            await validate_connections_startup(require_all=settings.REQUIRE_ALL_CONNECTIONS)
            logger.info("✅ Database connection requirements satisfied!")
            
        except Exception as e:
            logger.critical(f"❌ Failed to establish required connections: {str(e)}")
            raise
    
    async def _log_connection_details(self) -> None:
        """Log detailed status of individual connections"""
        try:
            connection_details = await check_all_connections()
            
            # Log PostgreSQL connection status
            if connection_details["database"]["connected"]:
                logger.info("  🗄️  PostgreSQL: healthy")
            else:
                logger.warning("  🗄️  PostgreSQL: not connected (some features may be unavailable)")
            
            # Log Supabase connection status
            if connection_details["supabase"]["connected"]:
                logger.info("  ⚡ Supabase: healthy")
            else:
                logger.warning("  ⚡ Supabase: not connected (some features may be unavailable)")
                
        except Exception as e:
            logger.warning(f"⚠️  Could not retrieve detailed connection status: {str(e)}")
    
    def _log_startup_success(self) -> None:
        """Log successful startup completion"""
        startup_duration = (datetime.now() - self.startup_time).total_seconds()
        logger.info(f"🎯 VANTAGE API server startup complete! ({startup_duration:.2f}s)")
    
    def log_shutdown(self) -> None:
        """Log application shutdown"""
        logger.info("🛑 Shutting down VANTAGE API server...")
        logger.info("👋 Goodbye!")
    
    async def get_health_status(self) -> Dict[str, Any]:
        """
        Get current health status for health check endpoints.
        
        Returns:
            Dict containing overall health status and connection details
        """
        try:
            connection_details = await check_all_connections()
            connection_details["timestamp"] = datetime.now().isoformat()
            return connection_details
        except Exception as e:
            logger.error(f"Health check failed: {str(e)}")
            return {
                "overall_status": "unhealthy",
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }


# Singleton instance for use across the application
startup_service = StartupService() 