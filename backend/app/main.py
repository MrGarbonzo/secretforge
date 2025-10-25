"""FastAPI application entry point."""
import logging
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routes import chat, health, diagnostic, config
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

# Include routers
app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(diagnostic.router, prefix="/api", tags=["diagnostic"])
app.include_router(chat.router, prefix="/api", tags=["chat"])
app.include_router(config.router)

# Mount static files
static_dir = Path(__file__).parent / "static"
app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")

# Root endpoint - serve chat UI from static files
@app.get("/", response_class=FileResponse)
async def root():
    """Serve the appropriate chat UI based on agent type."""
    if settings.AGENT_TYPE == "simple":
        logger.info("Serving Simple Agent UI")
        return FileResponse(str(static_dir / "index-simple.html"))
    else:
        logger.info("Serving Secret Agent UI")
        return FileResponse(str(static_dir / "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.RELOAD
    )
