"""SecretAI integration service using OpenAI-compatible endpoint."""
import logging
from typing import List, Optional
from openai import AsyncOpenAI

from app.config import settings
from app.models import Message

logger = logging.getLogger(__name__)

class SecretAIService:
    """Service for interacting with SecretAI via OpenAI-compatible endpoint."""

    def __init__(self):
        """Initialize SecretAI service."""
        self.client: Optional[AsyncOpenAI] = None
        self.model: str = "gemma3:4b"
        self.base_url: str = "https://secretai-rytn.scrtlabs.com:21434/v1"
        self._initialized = False
        self._last_error: Optional[str] = None

    async def initialize(self):
        """Initialize the SecretAI client."""
        if self._initialized:
            return

        try:
            if not settings.SECRET_AI_API_KEY:
                raise ValueError("SECRET_AI_API_KEY environment variable not set")

            logger.info(f"Initializing SecretAI OpenAI-compatible client")
            logger.info(f"  Endpoint: {self.base_url}")
            logger.info(f"  Model: {self.model}")

            # Initialize OpenAI client with SecretAI endpoint
            self.client = AsyncOpenAI(
                base_url=self.base_url,
                api_key=settings.SECRET_AI_API_KEY,
                default_headers={
                    "X-API-Key": settings.SECRET_AI_API_KEY
                }
            )

            self._initialized = True
            logger.info("SecretAI service initialized successfully")

        except Exception as e:
            self._last_error = str(e)
            logger.error(f"Failed to initialize SecretAI service: {e}", exc_info=True)
            raise

    async def chat(
        self,
        message: str,
        history: List[Message] = None
    ) -> str:
        """
        Send a chat message and get response.

        Args:
            message: User message
            history: Previous conversation history

        Returns:
            AI response text
        """
        if not self._initialized:
            await self.initialize()

        try:
            # Build message history in OpenAI format
            messages = []

            # Add conversation history
            if history:
                for msg in history[-10:]:  # Last 10 messages
                    messages.append({"role": msg.role, "content": msg.content})

            # Add current message
            messages.append({"role": "user", "content": message})

            # Use OpenAI client
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                stream=False
            )

            return response.choices[0].message.content

        except Exception as e:
            logger.error(f"Chat error: {e}")
            raise

    async def chat_stream(
        self,
        message: str,
        history: List[Message] = None
    ):
        """
        Stream chat message responses.

        Args:
            message: User message
            history: Previous conversation history

        Yields:
            Response chunks as they arrive
        """
        if not self._initialized:
            await self.initialize()

        try:
            # Build message history in OpenAI format
            messages = []

            # Add conversation history
            if history:
                for msg in history[-10:]:  # Last 10 messages
                    messages.append({"role": msg.role, "content": msg.content})

            # Add current message
            messages.append({"role": "user", "content": message})

            # Use OpenAI client with streaming
            stream = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                stream=True
            )

            # Stream chunks as they arrive
            async for chunk in stream:
                if chunk.choices and len(chunk.choices) > 0:
                    delta = chunk.choices[0].delta
                    if hasattr(delta, 'content') and delta.content:
                        yield delta.content

        except Exception as e:
            logger.error(f"Streaming error: {e}")
            raise

# Global service instance
secret_ai_service = SecretAIService()
