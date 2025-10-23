"""SecretAI integration service."""
import logging
import asyncio
import httpx
from typing import List, Optional
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
        self.model: Optional[str] = None
        self.base_url: Optional[str] = None
        self._initialized = False
        self._last_error: Optional[str] = None

    async def initialize(self):
        """Initialize the SecretAI clients."""
        if self._initialized:
            return

        try:
            if not settings.SECRET_AI_API_KEY:
                raise ValueError("SECRET_AI_API_KEY environment variable not set")

            # Initialize Secret Network client (sync SDK)
            self.secret_client = Secret(
                chain_id=settings.SECRET_CHAIN_ID,
                node_url=settings.SECRET_NODE_URL
            )

            # Get available models and URLs (run sync SDK calls in thread pool)
            models = await asyncio.to_thread(self.secret_client.get_models)
            if not models:
                raise ValueError("No models available from Secret Network")

            logger.info(f"Available models: {models}")

            # Select gemma model (prefer gemma3:4b)
            selected_model = None
            for model in models:
                if "gemma" in model.lower():
                    selected_model = model
                    break

            # Fallback to first model if gemma not found
            if not selected_model:
                selected_model = models[0]

            # Get service URLs for selected model (run sync SDK call in thread pool)
            urls = await asyncio.to_thread(self.secret_client.get_urls, model=selected_model)
            if not urls:
                raise ValueError(f"No service URLs available for model: {selected_model}")

            self.model = selected_model
            self.base_url = urls[0]

            logger.info(f"Using model: {self.model}")
            logger.info(f"Using service URL: {self.base_url}")

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
            # Build message history in Ollama format
            messages = []

            # Add conversation history
            if history:
                for msg in history[-10:]:  # Last 10 messages
                    role = "user" if msg.role == "user" else "assistant"
                    messages.append({"role": role, "content": msg.content})

            # Add current message
            messages.append({"role": "user", "content": message})

            # Make direct HTTP request to Ollama-compatible endpoint
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    f"{self.base_url}/api/chat",
                    json={
                        "model": self.model,
                        "messages": messages,
                        "stream": False,
                        "options": {
                            "temperature": 0.7,
                        }
                    },
                    headers={
                        "Authorization": f"Bearer {settings.SECRET_AI_API_KEY}",
                        "Content-Type": "application/json"
                    }
                )
                response.raise_for_status()
                result = response.json()

                # Extract message content from Ollama response
                if "message" in result and "content" in result["message"]:
                    return result["message"]["content"]
                else:
                    logger.error(f"Unexpected response format: {result}")
                    raise ValueError("Unexpected response format from SecretAI")

        except httpx.HTTPError as e:
            logger.error(f"HTTP error: {e}")
            raise SecretAIError(f"Failed to get response from SecretAI: {e}")
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
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
            # Build message history in Ollama format
            messages = []

            # Add conversation history
            if history:
                for msg in history[-10:]:  # Last 10 messages
                    role = "user" if msg.role == "user" else "assistant"
                    messages.append({"role": role, "content": msg.content})

            # Add current message
            messages.append({"role": "user", "content": message})

            # Make streaming HTTP request to Ollama-compatible endpoint
            async with httpx.AsyncClient(timeout=60.0) as client:
                async with client.stream(
                    "POST",
                    f"{self.base_url}/api/chat",
                    json={
                        "model": self.model,
                        "messages": messages,
                        "stream": True,
                        "options": {
                            "temperature": 0.7,
                        }
                    },
                    headers={
                        "Authorization": f"Bearer {settings.SECRET_AI_API_KEY}",
                        "Content-Type": "application/json"
                    }
                ) as response:
                    response.raise_for_status()

                    # Stream the response line by line
                    async for line in response.aiter_lines():
                        if line.strip():
                            try:
                                import json
                                chunk_data = json.loads(line)

                                # Extract message content from chunk
                                if "message" in chunk_data and "content" in chunk_data["message"]:
                                    content = chunk_data["message"]["content"]
                                    if content:
                                        yield content

                                # Check if this is the final chunk
                                if chunk_data.get("done", False):
                                    break

                            except json.JSONDecodeError:
                                logger.warning(f"Failed to parse chunk: {line}")
                                continue

        except httpx.HTTPError as e:
            logger.error(f"HTTP error during streaming: {e}")
            raise SecretAIError(f"Failed to stream response from SecretAI: {e}")
        except Exception as e:
            logger.error(f"Unexpected error during streaming: {e}")
            raise

# Global service instance
secret_ai_service = SecretAIService()
