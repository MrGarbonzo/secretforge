"""Chat endpoints."""
import logging
from datetime import datetime
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from app.models import ChatRequest, ChatResponse
from app.services.secret_ai import secret_ai_service

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/chat")
async def chat(request: ChatRequest):
    """
    Chat endpoint.

    Send a message and get AI response. Supports both streaming and non-streaming.
    """
    try:
        # Ensure SecretAI is initialized before processing request
        if not secret_ai_service._initialized:
            try:
                await secret_ai_service.initialize()
            except Exception as init_error:
                error_msg = f"SecretAI initialization failed: {str(init_error)}"
                if secret_ai_service._last_error:
                    error_msg += f" (Last error: {secret_ai_service._last_error})"
                logger.error(error_msg)
                raise HTTPException(
                    status_code=503,
                    detail=error_msg
                )

        # Check if streaming is requested
        if request.stream:
            # Return streaming response
            async def generate():
                async for chunk in secret_ai_service.chat_stream(
                    message=request.message,
                    history=request.history
                ):
                    yield chunk

            return StreamingResponse(
                generate(),
                media_type="text/plain"
            )
        else:
            # Get regular response from SecretAI
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
