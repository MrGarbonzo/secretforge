"""Pydantic models for request/response validation."""
from typing import List, Literal, Optional
from pydantic import BaseModel, Field

class Message(BaseModel):
    """Chat message."""
    role: Literal["user", "assistant", "system"]
    content: str

class ChatRequest(BaseModel):
    """Chat request body."""
    message: str = Field(..., min_length=1, max_length=10000)
    history: List[Message] = Field(default_factory=list, max_length=50)
    stream: bool = False

class ChatResponse(BaseModel):
    """Chat response body."""
    response: str
    timestamp: str

class HealthResponse(BaseModel):
    """Health check response."""
    status: Literal["ok", "error"]
    version: str = "1.0.0"
    secret_ai: bool = False
    history_enabled: bool = False

class HistoryResponse(BaseModel):
    """Chat history response."""
    messages: List[Message]
    count: int
