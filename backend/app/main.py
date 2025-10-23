"""FastAPI application entry point."""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routes import chat, health
from app.services.secret_ai import secret_ai_service

# Configure logging
logging.basicConfig(
    level=settings.LOG_LEVEL,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    # Startup
    logger.info("Starting SecretForge Chat Service...")
    logger.info(f"VM Size: {settings.VM_SIZE}")
    logger.info(f"History Enabled: {settings.ENABLE_HISTORY}")

    # Initialize SecretAI
    try:
        await secret_ai_service.initialize()
    except Exception as e:
        logger.error(f"Failed to initialize SecretAI: {e}")
        logger.warning("Service will start but chat will not work!")

    yield

    # Shutdown
    logger.info("Shutting down SecretForge Chat Service...")

# Create FastAPI app
app = FastAPI(
    title="SecretForge Chat Service",
    description="Privacy-focused AI chat powered by Secret Network",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers (must be before static files mount)
app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(chat.router, prefix="/api", tags=["chat"])

# Serve static files (chat UI) - must be last
# This serves the simple chat interface at the root
app.mount("/", StaticFiles(directory="app/static", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.RELOAD
    )
