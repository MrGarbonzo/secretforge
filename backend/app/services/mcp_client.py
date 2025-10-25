"""HTTP-based MCP Client for Secret Network tools."""
import asyncio
import json
import logging
from typing import Any, Dict, List, Optional
import httpx
from app.config import settings

logger = logging.getLogger(__name__)


class MCPClient:
    """HTTP client for communicating with Secret Network MCP server."""

    def __init__(self):
        """Initialize the MCP client."""
        self.base_url = settings.SECRET_MCP_URL
        self.client: Optional[httpx.AsyncClient] = None
        self._initialized = False

    async def initialize(self):
        """Initialize the HTTP client."""
        if self._initialized:
            return

        try:
            logger.info("Initializing MCP HTTP client for Secret Network...")

            # Create async HTTP client
            self.client = httpx.AsyncClient(timeout=30.0)

            # Test connection to MCP server
            response = await self.client.get(f"{self.base_url}/api/health")
            response.raise_for_status()
            health_data = response.json()

            logger.info(f"MCP server health: {health_data}")

            self._initialized = True
            logger.info("MCP HTTP client initialized successfully")

        except Exception as e:
            logger.error(f"Failed to initialize MCP HTTP client: {e}")
            logger.warning(f"MCP server may not be running at {self.base_url}")
            raise

    async def list_tools(self) -> List[Dict[str, Any]]:
        """List available tools from the MCP server via HTTP."""
        if not self._initialized:
            await self.initialize()

        try:
            response = await self.client.get(f"{self.base_url}/api/mcp/tools/list")
            response.raise_for_status()
            data = response.json()

            # Extract tools array from response
            tools = data.get("tools", [])

            logger.info(f"Retrieved {len(tools)} tools from MCP server")
            return tools

        except Exception as e:
            logger.error(f"Failed to list tools: {e}")
            return []

    async def call_tool(self, tool_name: str, arguments: Dict[str, Any]) -> Any:
        """Call a tool on the MCP server via HTTP."""
        if not self._initialized:
            await self.initialize()

        try:
            logger.info(f"Calling tool {tool_name} with args: {arguments}")

            # Call the tool via HTTP POST
            response = await self.client.post(
                f"{self.base_url}/api/mcp/tools/call",
                json={
                    "name": tool_name,
                    "arguments": arguments
                }
            )
            response.raise_for_status()
            result = response.json()

            logger.info(f"Tool {tool_name} returned: {result}")
            return result

        except Exception as e:
            logger.error(f"Failed to call tool {tool_name}: {e}")
            raise

    async def close(self):
        """Close the HTTP client."""
        if self.client:
            try:
                await self.client.aclose()
            except Exception as e:
                logger.error(f"Error closing HTTP client: {e}")

        self._initialized = False
        self.client = None


# Singleton instance
mcp_client = MCPClient()
