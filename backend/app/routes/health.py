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

        return HealthResponse(
            status="ok",
            version="1.0.0",
            secret_ai=secret_ai_ok,
            history_enabled=settings.ENABLE_HISTORY
        )
    except Exception:
        return HealthResponse(
            status="error",
            version="1.0.0",
            secret_ai=False,
            history_enabled=settings.ENABLE_HISTORY
        )
