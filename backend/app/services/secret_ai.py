"""SecretAI integration service."""
import logging
from typing import List, Optional
from secret_ai_sdk.secret_ai import ChatSecret
from secret_ai_sdk.secret import Secret
from secret_ai_sdk.secret_ai_ex import SecretAIError

from app.config import settings
from app.models import Message

logger = logging.getLogger(__name__)

class SecretAIService:
    """Service for interacting with SecretAI."""

    def __init__(self):
        """Initialize SecretAI service."""
        self.secret_client: Optional[Secret] = None
        self.chat_client: Optional[ChatSecret] = None
        self._initialized = False

    async def initialize(self):
        """Initialize the SecretAI clients."""
        if self._initialized:
            return

        try:
            # Initialize Secret Network client
            self.secret_client = Secret(
                chain_id=settings.SECRET_CHAIN_ID,
                node_url=settings.SECRET_NODE_URL
            )

            # Get available models and URLs
            models = self.secret_client.get_models()
            if not models:
                raise ValueError("No models available")

            logger.info(f"Available models: {models}")

            # Get service URLs for first model
            urls = self.secret_client.get_urls(model=models[0])
            if not urls:
                raise ValueError("No service URLs available")

            logger.info(f"Using service URL: {urls[0]}")

            # Initialize chat client
            self.chat_client = ChatSecret(
                base_url=urls[0],
                model=models[0],
                temperature=0.7,
                max_tokens=2048
            )

            self._initialized = True
            logger.info("SecretAI service initialized successfully")

        except Exception as e:
            logger.error(f"Failed to initialize SecretAI service: {e}")
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
            # Build message history in LangChain format
            messages = []

            # Add conversation history
            if history:
                for msg in history[-10:]:  # Last 10 messages
                    role = "human" if msg.role == "user" else "ai"
                    messages.append((role, msg.content))

            # Add current message
            messages.append(("human", message))

            # Get response from SecretAI
            response = self.chat_client.invoke(messages, stream=False)

            return response.content

        except SecretAIError as e:
            logger.error(f"SecretAI error: {e}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            raise

# Global service instance
secret_ai_service = SecretAIService()
