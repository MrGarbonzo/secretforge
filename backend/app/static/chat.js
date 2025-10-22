// Chat functionality
const messagesContainer = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

let chatHistory = [];

// Add message to UI
function addMessage(content, role = 'user') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${role}`;
    messageDiv.textContent = content;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Send message to API
async function sendMessage(message) {
    try {
        sendButton.disabled = true;
        sendButton.textContent = 'Sending...';

        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                history: chatHistory,
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Add to history
        chatHistory.push({ role: 'user', content: message });
        chatHistory.push({ role: 'assistant', content: data.response });

        // Display response
        addMessage(data.response, 'assistant');

    } catch (error) {
        console.error('Error:', error);
        addMessage(`Error: ${error.message}`, 'system');
    } finally {
        sendButton.disabled = false;
        sendButton.textContent = 'Send';
    }
}

// Handle form submission
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const message = messageInput.value.trim();
    if (!message) return;

    // Display user message
    addMessage(message, 'user');

    // Clear input
    messageInput.value = '';

    // Send to API
    await sendMessage(message);
});

// Add welcome message
addMessage('Welcome to SecretForge Chat! Your conversations are private and encrypted.', 'system');
