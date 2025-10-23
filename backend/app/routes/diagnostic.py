"""Diagnostic endpoints."""
from fastapi import APIRouter
from app.models import DiagnosticResponse
from app.config import settings
from app.services.secret_ai import secret_ai_service

router = APIRouter()

@router.get("/diagnostic", response_model=DiagnosticResponse)
async def diagnostic():
    """Diagnostic endpoint to check SecretAI configuration and status."""
    # Check if API key is set
    api_key = settings.SECRET_AI_API_KEY
    api_key_set = bool(api_key)

    # Create masked preview of API key (first 4 and last 4 chars)
    api_key_preview = None
    if api_key and len(api_key) > 8:
        api_key_preview = f"{api_key[:4]}...{api_key[-4:]}"
    elif api_key:
        api_key_preview = f"{api_key[:2]}...{api_key[-2:]}"

    return DiagnosticResponse(
        api_key_set=api_key_set,
        api_key_preview=api_key_preview,
        secret_ai_initialized=secret_ai_service._initialized,
        last_error=secret_ai_service._last_error,
        model=secret_ai_service.model,
        base_url=secret_ai_service.base_url,
        chain_id=settings.SECRET_CHAIN_ID,
        node_url=settings.SECRET_NODE_URL
    )
