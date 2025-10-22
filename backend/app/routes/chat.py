"""Chat endpoints."""
import logging
from datetime import datetime
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from app.models import ChatRequest, ChatResponse
from app.services.secret_ai import secret_ai_service

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Chat endpoint.

    Send a message and get AI response.
    """
    try:
        # Get response from SecretAI
        response = await secret_ai_service.chat(
            message=request.message,
            history=request.history
        )

        return ChatResponse(
            response=response,
            timestamp=datetime.utcnow().isoformat()
        )

    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get response: {str(e)}"
        )

@router.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    """
    Streaming chat endpoint.

    Stream AI response in real-time.
    """
    # TODO: Implement streaming with SecretAI SDK
    # For now, return regular response
    raise HTTPException(
        status_code=501,
        detail="Streaming not yet implemented"
    )
