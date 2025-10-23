"""Health check endpoints."""
from fastapi import APIRouter
from app.models import HealthResponse
from app.config import settings
from app.services.secret_ai import secret_ai_service

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
async def health():
    """Health check endpoint."""
    try:
        # Check if SecretAI is initialized
        secret_ai_ok = secret_ai_service._initialized
        secret_ai_error = secret_ai_service._last_error if not secret_ai_ok else None

        return HealthResponse(
            status="ok" if secret_ai_ok else "error",
            version="1.0.0",
            secret_ai=secret_ai_ok,
            secret_ai_error=secret_ai_error,
            history_enabled=settings.ENABLE_HISTORY
        )
    except Exception as e:
        return HealthResponse(
            status="error",
            version="1.0.0",
            secret_ai=False,
            secret_ai_error=str(e),
            history_enabled=settings.ENABLE_HISTORY
        )
