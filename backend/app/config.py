"""Configuration management."""
import os
from typing import Literal
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Application settings."""

    # API Settings
    SECRET_AI_API_KEY: str = os.getenv("SECRET_AI_API_KEY", "")

    # Server Settings
    HOST: str = "0.0.0.0"
    PORT: int = 3000
    RELOAD: bool = False

    # Application Settings
    ENABLE_HISTORY: bool = os.getenv("ENABLE_HISTORY", "false").lower() == "true"
    VM_SIZE: Literal["small", "medium", "large"] = os.getenv("VM_SIZE", "small")

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./chat_history.db"

    # Secret Network
    SECRET_CHAIN_ID: str = "pulsar-3"
    SECRET_NODE_URL: str = os.getenv(
        "SECRET_NODE_URL",
        "https://pulsar.lcd.secretnodes.com"
    )

    # Logging
    LOG_LEVEL: str = "INFO"

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
