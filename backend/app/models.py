"""Pydantic models for request/response validation."""
from typing import Dict, List, Literal, Optional
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
    wallet_address: Optional[str] = None
    viewing_keys: Optional[Dict[str, str]] = None  # token_symbol -> viewing_key
    snip_balances: Optional[Dict[str, Dict]] = None  # Pre-fetched SNIP-20 balances from frontend
    scrt_balance: Optional[Dict] = None  # Pre-fetched SCRT balance from frontend

class ChatResponse(BaseModel):
    """Chat response body."""
    response: str
    timestamp: str

class HealthResponse(BaseModel):
    """Health check response."""
    status: Literal["ok", "error"]
    version: str = "1.0.0"
    secret_ai: bool = False
    secret_ai_error: Optional[str] = None
    history_enabled: bool = False

class HistoryResponse(BaseModel):
    """Chat history response."""
    messages: List[Message]
    count: int

class DiagnosticResponse(BaseModel):
    """Diagnostic information."""
    api_key_set: bool
    api_key_preview: Optional[str] = None
    secret_ai_initialized: bool
    last_error: Optional[str] = None
    model: Optional[str] = None
    base_url: Optional[str] = None
