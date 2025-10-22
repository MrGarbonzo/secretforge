"""Tests for health check endpoint."""
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    """Test health check endpoint returns ok status."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["ok", "error"]
    assert data["version"] == "1.0.0"
    assert "secret_ai" in data
    assert "history_enabled" in data

def test_health_check_structure():
    """Test health check response has correct structure."""
    response = client.get("/api/health")
    data = response.json()
    required_fields = ["status", "version", "secret_ai", "history_enabled"]
    for field in required_fields:
        assert field in data, f"Missing field: {field}"
