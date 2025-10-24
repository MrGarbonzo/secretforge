// SecretForge Chat Interface
// Simplified version adapted from secretGPT for SecretForge backend

const ChatState = {
    messages: [],
    isStreaming: false,
    walletConnected: false,
    walletAddress: null
};

const ChatInterface = {
    init() {
        console.log('🔮 Initializing SecretForge chat interface...');
        this.setupEventListeners();
        this.syncWalletState();
        console.log('✅ Chat interface initialized');
    },

    setupEventListeners() {
        const chatForm = document.getElementById('chat-form');
        const messageInput = document.getElementById('message-input');

        if (chatForm) {
            chatForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const message = messageInput.value.trim();
                if (!message || ChatState.isStreaming) return;

                this.addMessage(message, 'user');
                messageInput.value = '';
                await this.sendMessage(message);
            });
        }
    },

    addMessage(content, role = 'user') {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${role}`;
        messageDiv.textContent = content;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return messageDiv;
    },

    async sendMessage(message) {
        ChatState.isStreaming = true;
        const sendButton = document.getElementById('send-button');
        if (sendButton) {
            sendButton.disabled = true;
            sendButton.textContent = 'Sending...';
        }

        let assistantMessageDiv = null;
        let fullResponse = '';

        try {
            // Sync wallet state before sending
            this.syncWalletState();

            const requestBody = {
                message: message,
                history: ChatState.messages,
                stream: false  // Keep streaming disabled for now - tool calling works better without it
            };

            // Add wallet address and viewing keys if connected
            if (ChatState.walletConnected && ChatState.walletAddress) {
                requestBody.wallet_address = ChatState.walletAddress;
                console.log('📱 Sending with wallet address:', ChatState.walletAddress);

                // Add viewing keys if available
                if (window.WalletState && window.WalletState.viewingKeys) {
                    requestBody.viewing_keys = window.WalletState.viewingKeys;
                    console.log('🔑 Sending with viewing keys for:', Object.keys(window.WalletState.viewingKeys));
                }

                // PRE-FETCH SNIP-20 BALANCES (secretGPT approach)
                // Detect SNIP token queries in the message
                const detectedTokens = this.detectSnipTokens(message);
                if (detectedTokens.length > 0 && window.SNIPTokenManager) {
                    console.log('🎯 Detected SNIP token query for:', detectedTokens);

                    const snipBalances = {};
                    for (const token of detectedTokens) {
                        try {
                            console.log(`💰 Pre-fetching balance for ${token}...`);
                            const balanceResult = await window.SNIPTokenManager.querySnip20Balance(token);
                            if (balanceResult.success) {
                                snipBalances[token.toLowerCase()] = balanceResult;
                                console.log(`✅ Pre-fetched ${token} balance: ${balanceResult.formatted}`);
                            } else {
                                console.log(`⚠️ Failed to fetch ${token} balance:`, balanceResult.error);
                            }
                        } catch (error) {
                            console.error(`❌ Error fetching ${token} balance:`, error);
                        }
                    }

                    // Add pre-fetched balances to request
                    if (Object.keys(snipBalances).length > 0) {
                        requestBody.snip_balances = snipBalances;
                        console.log('📦 Sending pre-fetched SNIP balances:', Object.keys(snipBalances));
                    }
                }
            }

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            // Get JSON response
            const data = await response.json();
            fullResponse = data.response;

            // Display assistant response
            assistantMessageDiv = this.addMessage(fullResponse, 'assistant');

            // Update chat history
            ChatState.messages.push({ role: 'user', content: message });
            ChatState.messages.push({ role: 'assistant', content: fullResponse });

        } catch (error) {
            console.error('Error:', error);
            this.addMessage(`Error: ${error.message}`, 'system');
        } finally {
            ChatState.isStreaming = false;
            if (sendButton) {
                sendButton.disabled = false;
                sendButton.textContent = 'Send';
            }
        }
    },

    syncWalletState() {
        // Sync with WalletState from wallet.js
        if (window.WalletState) {
            ChatState.walletConnected = window.WalletState.connected || false;
            ChatState.walletAddress = window.WalletState.address || null;
            console.log('📱 Wallet state synced:', {
                connected: ChatState.walletConnected,
                address: ChatState.walletAddress
            });
        }
    },

    detectSnipTokens(message) {
        // Detect SNIP-20 token queries in the message
        // Returns array of detected token symbols
        const detectedTokens = [];
        const messageLower = message.toLowerCase();

        // List of supported SNIP tokens
        const snipTokens = ['shd', 'silk', 'sscrt', 'stkd-scrt', 'sinj', 'swbtc', 'susdt', 'snobleusdc'];

        // Patterns to detect token queries
        for (const token of snipTokens) {
            const patterns = [
                `\\b${token}\\s+balance\\b`,
                `\\bmy\\s+${token}\\b`,
                `\\bcheck\\s+${token}\\b`,
                `\\bhow\\s+much\\s+${token}\\b`,
                `\\b${token}\\s+amount\\b`,
                `\\bbalance\\s+of\\s+${token}\\b`,
                `\\bquery\\s+${token}\\b`,
                `\\bshow\\s+${token}\\b`,
                `\\b${token}\\s+tokens\\b`
            ];

            for (const pattern of patterns) {
                const regex = new RegExp(pattern, 'i');
                if (regex.test(messageLower)) {
                    if (!detectedTokens.includes(token)) {
                        detectedTokens.push(token);
                    }
                    break; // Found this token, move to next
                }
            }
        }

        return detectedTokens;
    }
};

// Export for global access
window.ChatInterface = ChatInterface;
window.ChatState = ChatState;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        ChatInterface.init();
    });
} else {
    ChatInterface.init();
}
