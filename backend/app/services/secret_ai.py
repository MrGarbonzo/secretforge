"""SecretAI integration service using OpenAI-compatible endpoint."""
import json
import logging
import re
from typing import List, Optional, Dict, Any
from openai import AsyncOpenAI

from app.config import settings
from app.models import Message
from app.services.mcp_client import mcp_client

logger = logging.getLogger(__name__)

# SNIP-20 token symbols that we support
SNIP20_TOKENS = ['shd', 'silk', 'sscrt', 'stkd-scrt', 'sinj', 'swbtc', 'susdt', 'snobleusdc']

class SecretAIService:
    """Service for interacting with SecretAI via OpenAI-compatible endpoint."""

    def __init__(self):
        """Initialize SecretAI service."""
        self.client: Optional[AsyncOpenAI] = None
        self.model: str = "gemma3:4b"
        self.base_url: str = "https://secretai-rytn.scrtlabs.com:21434/v1"
        self._initialized = False
        self._last_error: Optional[str] = None
        self._tools: List[Dict[str, Any]] = []

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

            # Initialize MCP client if Secret Network is enabled
            if settings.ENABLE_SECRET_NETWORK:
                logger.info("Secret Network enabled, initializing MCP client...")
                await mcp_client.initialize()
                await self._load_tools()

        except Exception as e:
            self._last_error = str(e)
            logger.error(f"Failed to initialize SecretAI service: {e}", exc_info=True)
            raise

    async def _load_tools(self):
        """Load tools from MCP and build tool descriptions for prompt."""
        try:
            mcp_tools = await mcp_client.list_tools()
            self._tools = []

            for tool in mcp_tools:
                # Handle both dict and object responses from MCP
                if isinstance(tool, dict):
                    tool_name = tool.get("name", "")
                    tool_description = tool.get("description", "")
                    tool_params = tool.get("inputSchema", {
                        "type": "object",
                        "properties": {},
                        "required": []
                    })
                else:
                    tool_name = tool.name
                    tool_description = tool.description or ""
                    tool_params = tool.inputSchema if hasattr(tool, 'inputSchema') else {
                        "type": "object",
                        "properties": {},
                        "required": []
                    }

                # Store tool metadata for prompt-based calling
                tool_info = {
                    "name": tool_name,
                    "description": tool_description,
                    "parameters": tool_params
                }
                self._tools.append(tool_info)
                logger.info(f"Loaded tool: {tool_name}")

            logger.info(f"Loaded {len(self._tools)} MCP tools")
        except Exception as e:
            logger.error(f"Failed to load MCP tools: {e}")
            import traceback
            traceback.print_exc()
            self._tools = []

    def _build_tool_descriptions(self) -> str:
        """Build tool descriptions string for system prompt."""
        if not self._tools:
            return ""

        tool_descriptions = []
        for tool in self._tools:
            desc = f"- {tool['name']}: {tool['description']}"
            tool_descriptions.append(desc)

        return "\n".join(tool_descriptions)

    def _extract_tool_calls_from_text(self, text: str) -> List[Dict[str, Any]]:
        """Extract tool calls from AI response text using regex pattern."""
        # Pattern: USE_TOOL: tool_name with arguments {...}
        pattern = r'USE_TOOL:\s*(\w+)\s+with\s+arguments\s*(\{[^}]*\})'
        matches = re.findall(pattern, text, re.IGNORECASE)

        tool_calls = []
        for tool_name, args_str in matches:
            try:
                # Parse JSON arguments
                arguments = json.loads(args_str) if args_str.strip() != '{}' else {}
                tool_calls.append({
                    "name": tool_name,
                    "arguments": arguments
                })
            except json.JSONDecodeError:
                logger.warning(f"Failed to parse arguments for tool {tool_name}: {args_str}")
                # Try with empty arguments
                tool_calls.append({
                    "name": tool_name,
                    "arguments": {}
                })

        return tool_calls

    def _detect_snip20_query(self, message: str) -> Optional[str]:
        """
        Detect if the message is asking for a SNIP-20 token balance.
        Returns the token symbol if detected, None otherwise.
        """
        message_lower = message.lower()

        # Check for each SNIP-20 token
        for token in SNIP20_TOKENS:
            # Pattern: "my {token} balance", "{token} balance", "check {token}", "how much {token}"
            patterns = [
                rf'\b{token}\s+balance\b',
                rf'\bmy\s+{token}\b',
                rf'\bcheck\s+{token}\b',
                rf'\bhow\s+much\s+{token}\b',
                rf'\b{token}\s+amount\b',
                rf'\bbalance\s+of\s+{token}\b',
                rf'\bquery\s+{token}\b'
            ]

            for pattern in patterns:
                if re.search(pattern, message_lower):
                    logger.info(f"🎯 Detected SNIP-20 query for token: {token}")
                    return token

        return None

    async def chat(
        self,
        message: str,
        history: List[Message] = None,
        wallet_address: Optional[str] = None,
        viewing_keys: Optional[Dict[str, str]] = None,
        snip_balances: Optional[Dict[str, Dict]] = None
    ) -> str:
        """
        Send a chat message and get response using prompt-based tool calling.

        Args:
            message: User message
            history: Previous conversation history
            wallet_address: Connected Keplr wallet address (optional)
            viewing_keys: SNIP-20 viewing keys from Keplr (optional)
            snip_balances: Pre-fetched SNIP-20 balances from frontend (optional)

        Returns:
            AI response text
        """
        if not self._initialized:
            await self.initialize()

        try:
            # PRE-PROCESSING: Use pre-fetched SNIP-20 balances from frontend
            detected_token = self._detect_snip20_query(message)
            if detected_token and snip_balances:
                # Check if we have a pre-fetched balance for this token
                if detected_token.lower() in snip_balances:
                    logger.info(f"✅ Using pre-fetched balance for {detected_token.upper()}")
                    balance_data = snip_balances[detected_token.lower()]

                    if balance_data.get("success"):
                        formatted = balance_data.get("formatted", "0.00")
                        token_symbol = balance_data.get("token", detected_token.upper())

                        # Return formatted response
                        return f"Your {token_symbol} balance is {formatted} {token_symbol}"
                    else:
                        error = balance_data.get("error", "Unknown error")
                        return f"Sorry, I couldn't retrieve your {detected_token.upper()} balance: {error}"
            elif detected_token:
                # No pre-fetched balances available - inform user they need to check via Keplr
                return f"To check your {detected_token.upper()} balance, please use your Keplr wallet. SNIP-20 token balances require viewing keys which can only be managed through your wallet."

            # Build message history in OpenAI format
            messages = []

            # Add system prompt with tool descriptions if tools available
            if self._tools:
                tool_descriptions = self._build_tool_descriptions()
                system_prompt = f"""You are a helpful AI assistant with access to Secret Network blockchain tools.

Available tools:
{tool_descriptions}

To use a tool, respond with:
USE_TOOL: tool_name with arguments {{argument_key: "value"}}

Examples:
- USE_TOOL: secret_query_block with arguments {{}}
- USE_TOOL: secret_query_balance with arguments {{"address": "secret1abc..."}}

Important:
- For SCRT balance queries, use secret_query_balance
- For SNIP-20 token balances (SHD, SILK, stkd-SCRT, etc.), these are only available via the user's Keplr wallet

Only use tools when needed. For general questions, respond normally."""

                # Enhance system prompt with wallet context
                if wallet_address:
                    system_prompt += f"\n\nThe user has connected their Keplr wallet with address: {wallet_address}. You can help them with Secret Network transactions, balance queries, and other blockchain operations."

                messages.append({"role": "system", "content": system_prompt})

            # Add conversation history
            if history:
                for msg in history[-10:]:  # Last 10 messages
                    messages.append({"role": msg.role, "content": msg.content})

            # Add current message
            messages.append({"role": "user", "content": message})

            # Tool calling loop
            max_iterations = 5
            for iteration in range(max_iterations):
                logger.info(f"Tool calling iteration {iteration + 1}/{max_iterations}")

                # Prepare request kwargs (NO tools parameter)
                request_kwargs = {
                    "model": self.model,
                    "messages": messages,
                    "stream": False,
                    "max_tokens": 512,  # Limit response length
                    "temperature": 0.7   # Balanced creativity/focus
                }

                # Call LLM
                response = await self.client.chat.completions.create(**request_kwargs)
                assistant_content = response.choices[0].message.content or ""

                logger.info(f"AI response: {assistant_content[:200]}...")

                # Extract tool calls from text
                tool_calls = self._extract_tool_calls_from_text(assistant_content)

                if tool_calls:
                    logger.info(f"Found {len(tool_calls)} tool calls in response")

                    # Add assistant message to history
                    messages.append({
                        "role": "assistant",
                        "content": assistant_content
                    })

                    # Execute each tool call
                    tool_results = []
                    for tool_call in tool_calls:
                        tool_name = tool_call["name"]
                        tool_args = tool_call["arguments"]

                        logger.info(f"Executing tool: {tool_name} with args: {tool_args}")

                        try:
                            # Call MCP tool
                            tool_result = await mcp_client.call_tool(tool_name, tool_args)
                            result_str = json.dumps(tool_result)
                            tool_results.append(f"{tool_name}: {result_str}")
                            logger.info(f"Tool {tool_name} result: {result_str[:200]}...")
                        except Exception as e:
                            logger.error(f"Tool execution failed: {e}")
                            error_str = json.dumps({"error": str(e)})
                            tool_results.append(f"{tool_name}: {error_str}")

                    # Add tool results to messages as user message
                    results_message = "Tool results:\n" + "\n".join(tool_results)
                    messages.append({
                        "role": "user",
                        "content": results_message
                    })

                    # Continue loop to get final response
                else:
                    # No tool calls, return final answer
                    logger.info("No tool calls found, returning response")
                    return assistant_content

            # Max iterations reached
            logger.warning("Max tool calling iterations reached")
            return "I apologize, but I've reached the maximum number of tool calls. Please try rephrasing your question."

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
