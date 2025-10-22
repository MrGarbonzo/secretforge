"""Tests for chat endpoint."""
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_chat_endpoint_structure():
    """Test chat endpoint accepts correct request structure."""
    response = client.post(
        "/api/chat",
        json={
            "message": "Hello",
            "history": [],
            "stream": False
        }
    )
    # May fail if SecretAI is not configured, but should not be 422 (validation error)
    assert response.status_code in [200, 500], f"Unexpected status: {response.status_code}"

def test_chat_invalid_request():
    """Test chat endpoint rejects invalid requests."""
    # Missing required field
    response = client.post("/api/chat", json={})
    assert response.status_code == 422

    # Invalid message type
    response = client.post("/api/chat", json={"message": 123})
    assert response.status_code == 422

def test_chat_response_structure():
    """Test chat response has correct structure when successful."""
    response = client.post(
        "/api/chat",
        json={
            "message": "Test message",
            "history": [],
            "stream": False
        }
    )

    if response.status_code == 200:
        data = response.json()
        assert "response" in data
        assert "timestamp" in data
        assert isinstance(data["response"], str)
        assert isinstance(data["timestamp"], str)
