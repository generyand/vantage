#!/usr/bin/env python3
"""
🔄 Celery Worker Script
Script to run Celery workers for background task processing

Usage:
    # Start a worker for all tasks
    celery -A app.core.celery_app worker --loglevel=info

    # Start a worker for specific queues
    celery -A app.core.celery_app worker --loglevel=info --queues=notifications,classification

    # Start a worker with concurrency
    celery -A app.core.celery_app worker --loglevel=info --concurrency=4

    # Start a worker in development mode with auto-reload
    celery -A app.core.celery_app worker --loglevel=info --reload
"""

import os
import sys

# Add the app directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

if __name__ == "__main__":
    from app.core.celery_app import celery_app

    # Start the worker
    celery_app.worker_main()
