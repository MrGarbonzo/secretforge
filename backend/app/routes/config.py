"""Configuration endpoint for frontend feature detection."""
from fastapi import APIRouter
from pydantic import BaseModel

from app.config import settings

router = APIRouter(prefix="/api", tags=["config"])


class ConfigResponse(BaseModel):
    """Configuration response model."""
    secretNetwork: bool


@router.get("/config", response_model=ConfigResponse)
async def get_config():
    """
    Get application configuration for frontend.

    Returns:
        Configuration including enabled features
    """
    return ConfigResponse(
        secretNetwork=settings.ENABLE_SECRET_NETWORK
    )
