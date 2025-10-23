"""FastAPI application entry point."""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
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

# Include routers
app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(chat.router, prefix="/api", tags=["chat"])

# Root endpoint - serve chat UI as inline HTML
@app.get("/", response_class=HTMLResponse)
async def root():
    """Serve the chat UI."""
    return """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SecretForge Chat</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; background: #0A0A0A; color: #FFFFFF; line-height: 1.6; }
        .container { max-width: 800px; margin: 0 auto; height: 100vh; display: flex; flex-direction: column; padding: 20px; }
        .chat-header { text-align: center; padding: 20px 0; border-bottom: 1px solid #2A2A2A; margin-bottom: 20px; }
        .chat-header h1 { font-size: 24px; font-weight: 600; margin-bottom: 8px; }
        .subtitle { font-size: 14px; color: #B0B0B0; }
        .chat-messages { flex: 1; overflow-y: auto; padding: 20px 0; display: flex; flex-direction: column; gap: 16px; }
        .message { padding: 12px 16px; border-radius: 8px; max-width: 80%; word-wrap: break-word; }
        .message-user { align-self: flex-end; background: #FFFFFF; color: #1A1A1A; }
        .message-assistant { align-self: flex-start; background: #1A1A1A; color: #FFFFFF; border: 1px solid #2A2A2A; }
        .message-system { align-self: center; background: #F59E0B; color: #1A1A1A; font-size: 14px; }
        .chat-form { display: flex; gap: 12px; padding-top: 20px; border-top: 1px solid #2A2A2A; }
        #message-input { flex: 1; padding: 12px 16px; border: 1px solid #2A2A2A; border-radius: 8px; background: #1A1A1A; color: #FFFFFF; font-size: 16px; outline: none; }
        #message-input:focus { border-color: #FFFFFF; }
        #send-button { padding: 12px 24px; background: #FFFFFF; color: #1A1A1A; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: opacity 0.2s; }
        #send-button:hover { opacity: 0.9; }
        #send-button:disabled { opacity: 0.5; cursor: not-allowed; }
        .chat-messages::-webkit-scrollbar { width: 8px; }
        .chat-messages::-webkit-scrollbar-track { background: #1A1A1A; }
        .chat-messages::-webkit-scrollbar-thumb { background: #404040; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="chat-header">
            <h1>SecretForge Chat</h1>
            <p class="subtitle">Privacy-first AI powered by Secret Network</p>
        </div>
        <div id="chat-messages" class="chat-messages"></div>
        <form id="chat-form" class="chat-form">
            <input type="text" id="message-input" placeholder="Type your message..." autocomplete="off" required />
            <button type="submit" id="send-button">Send</button>
        </form>
    </div>
    <script>
        const messagesContainer = document.getElementById('chat-messages');
        const chatForm = document.getElementById('chat-form');
        const messageInput = document.getElementById('message-input');
        const sendButton = document.getElementById('send-button');
        let chatHistory = [];

        function addMessage(content, role = 'user') {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message message-${role}`;
            messageDiv.textContent = content;
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        async function sendMessage(message) {
            try {
                sendButton.disabled = true;
                sendButton.textContent = 'Sending...';
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: message, history: chatHistory, stream: false })
                });
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                chatHistory.push({ role: 'user', content: message });
                chatHistory.push({ role: 'assistant', content: data.response });
                addMessage(data.response, 'assistant');
            } catch (error) {
                console.error('Error:', error);
                addMessage(`Error: ${error.message}`, 'system');
            } finally {
                sendButton.disabled = false;
                sendButton.textContent = 'Send';
            }
        }

        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const message = messageInput.value.trim();
            if (!message) return;
            addMessage(message, 'user');
            messageInput.value = '';
            await sendMessage(message);
        });

        addMessage('Welcome to SecretForge Chat! Your conversations are private and encrypted.', 'system');
    </script>
</body>
</html>"""

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.RELOAD
    )
