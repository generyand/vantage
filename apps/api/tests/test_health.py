"""
🧪 Health Check Tests
Basic test example for 2-person team
"""

import pytest
from fastapi import status


def test_health_endpoint(client):
    """Test the health check endpoint works"""
    response = client.get("/health")
    
    assert response.status_code == status.HTTP_200_OK
    
    data = response.json()
    assert "overall_status" in data
    assert "timestamp" in data
    assert data["overall_status"] in ["healthy", "unhealthy"]


def test_root_endpoint(client):
    """Test the root endpoint works"""
    response = client.get("/")
    
    # Should return some kind of response (depends on your implementation)
    assert response.status_code in [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]


def test_api_docs_accessible(client):
    """Test that API documentation is accessible"""
    response = client.get("/docs")
    assert response.status_code == status.HTTP_200_OK
    
    response = client.get("/redoc")
    assert response.status_code == status.HTTP_200_OK


def test_openapi_schema_accessible(client):
    """Test that OpenAPI schema is accessible"""
    response = client.get("/openapi.json")
    assert response.status_code == status.HTTP_200_OK
    
    schema = response.json()
    assert "openapi" in schema
    assert "info" in schema 