// SecretGPTee Wallet Integration with SecretJS
// This file provides proper Keplr integration using the SecretJS library

// Import SecretJS components (loaded via CDN in HTML)
// Requires: secretjs library to be loaded before this script

// Wallet interface state
const WalletState = {
    connected: false,
    address: null,
    balance: null,
    network: 'secret-4', // Secret Network mainnet
    keplrInstalled: false,
    isConnecting: false,
    secretjs: null, // SecretNetworkClient instance
    offlineSigner: null,
    enigmaUtils: null,
    viewingKeys: {} // Viewing keys for SNIP-20 tokens (tokenAddress -> viewingKey)
};

// Keplr wallet configuration for Secret Network (Latest recommended endpoints)
const KEPLR_CHAIN_CONFIG = {
    chainId: 'secret-4',
    chainName: 'Secret Network',
    rpc: 'https://lcd.secret.adrius.starshell.net',
    rest: 'https://lcd.secret.adrius.starshell.net',
    bip44: {
        coinType: 529,
    },
    bech32Config: {
        bech32PrefixAccAddr: 'secret',
        bech32PrefixAccPub: 'secretpub',
        bech32PrefixValAddr: 'secretvaloper',
        bech32PrefixValPub: 'secretvaloperpub',
        bech32PrefixConsAddr: 'secretvalcons',
        bech32PrefixConsPub: 'secretvalconspub',
    },
    currencies: [{
        coinDenom: 'SCRT',
        coinMinimalDenom: 'uscrt',
        coinDecimals: 6,
        coinGeckoId: 'secret',
    }],
    feeCurrencies: [{
        coinDenom: 'SCRT',
        coinMinimalDenom: 'uscrt',
        coinDecimals: 6,
        coinGeckoId: 'secret',
        gasPriceStep: {
            low: 0.0125,
            average: 0.025,
            high: 0.05,
        },
    }],
    stakeCurrency: {
        coinDenom: 'SCRT',
        coinMinimalDenom: 'uscrt',
        coinDecimals: 6,
        coinGeckoId: 'secret',
    },
    coinType: 529,
    features: ['secretwasm', 'ibc-transfer', 'ibc-go'],
};

// Helper function to convert SCRT to uscrt
function scrtToUscrt(amount) {
    return String(Math.floor(parseFloat(amount) * 1000000));
}

// Helper function to convert string to coins array
function stringToCoins(amount) {
    return [{
        denom: 'uscrt',
        amount: amount
    }];
}

// SNIP-20 Token contracts (commonly used tokens)
const SNIP20_TOKENS = {
    'shd': 'secret153wu605vvp934xhd4k9dtd640zsep5jkesstdm',
    'silk': 'secret1fl449muk5yq8dlad7a22nje4p5d2pnsgymhjfd',
    'sscrt': 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek',
    'stkd-scrt': 'secret1k6u0cy4feepm6pehnz804zmwakuwdapm69tuc4',
    'sinj': 'secret14706vxakdzkz9a36872cs62vpl5qd84kpwvpew',
    'swbtc': 'secret1v2kgmfwgd2an0l5ddralajg5wfdkemxl2vg4jp',
    'susdt': 'secret1htd6s29m2j9h45knwkyucz98m306n32hx8dww3',
    'snobleusdc': 'secret1chsejpk9kfj4vt9ec6xvyguw539gsdtr775us2'
};

// Wallet interface management
const WalletInterface = {
    // Initialize wallet interface
    init() {
        console.log('🔮 Initializing SecretGPTee wallet interface with SecretJS...');
        
        // Check SecretJS availability first
        if (typeof SecretNetworkClient === 'undefined') {
            console.log('⏳ Waiting for SecretJS to load...');
            
            // Listen for SecretJS loaded event
            window.addEventListener('secretjs-loaded', () => {
                console.log('✅ SecretJS loaded event received, continuing initialization...');
                this.initAfterSecretJS();
            }, { once: true });
            
            // Fallback timeout after 10 seconds
            setTimeout(() => {
                if (typeof SecretNetworkClient === 'undefined') {
                    console.error('❌ SecretJS failed to load after 10 seconds');
                    this.showError('SecretJS library failed to load. Please refresh the page.');
                }
            }, 10000);
            
            return;
        }
        
        console.log('✅ SecretJS already available, continuing initialization...');
        this.initAfterSecretJS();
    },
    
    // Continue initialization after SecretJS is confirmed loaded
    initAfterSecretJS() {
        console.log('✅ SecretJS detected, continuing initialization...');
        this.checkKeplrInstallation();
        this.setupEventListeners();
        this.updateUI();
        
        console.log('✅ Wallet interface initialized');
    },
    
    // Show error message
    showError(message) {
        if (typeof SecretGPTee !== 'undefined' && SecretGPTee.showToast) {
            SecretGPTee.showToast(message, 'error');
        } else {
            console.error(message);
            alert(message); // Fallback
        }
    },
    
    // Check if Keplr wallet is installed
    checkKeplrInstallation() {
        const checkKeplr = () => {
            if (window.keplr) {
                WalletState.keplrInstalled = true;
                console.log('✅ Keplr wallet detected');
                return true;
            } else {
                WalletState.keplrInstalled = false;
                console.log('❌ Keplr wallet not found');
                return false;
            }
        };
        
        // Check immediately
        if (!checkKeplr()) {
            // Keplr might not be loaded yet, wait a bit and check again
            setTimeout(() => {
                checkKeplr();
                this.updateUI();
            }, 100);
        }
        
        // Listen for Keplr keystore changes
        window.addEventListener('keplr_keystorechange', () => {
            console.log('🔄 Keplr keystore changed, refreshing connection...');
            this.refreshConnection();
        });
    },
    
    // Setup event listeners
    setupEventListeners() {
        const connectBtn = document.getElementById('wallet-connect-btn');
        const disconnectBtn = document.getElementById('disconnect-wallet-btn');
        const refreshBalanceBtn = document.getElementById('refresh-balance-btn');
        
        if (connectBtn) {
            connectBtn.addEventListener('click', this.connectWallet.bind(this));
        }
        
        if (disconnectBtn) {
            disconnectBtn.addEventListener('click', this.disconnectWallet.bind(this));
        }
        
        if (refreshBalanceBtn) {
            refreshBalanceBtn.addEventListener('click', this.refreshBalance.bind(this));
        }
        
        // Auto-connect if previously connected
        // Increased delay to ensure ChatInterface is ready
        setTimeout(() => {
            this.tryAutoConnect();
        }, 500);
    },
    
    // Try to auto-connect wallet if previously connected
    async tryAutoConnect() {
        try {
            const savedAddress = localStorage.getItem('secretgptee-wallet-address');
            if (savedAddress && WalletState.keplrInstalled) {
                console.log('🔄 Attempting auto-connect to wallet...');
                await this.connectWallet(false); // Silent connection
            }
        } catch (error) {
            console.log('Auto-connect failed:', error);
        }
    },
    
    // Connect to Keplr wallet
    async connectWallet(showMessages = true) {
        if (!WalletState.keplrInstalled) {
            if (showMessages) {
                SecretGPTee.showToast('Please install Keplr wallet extension', 'error');
                this.showInstallModal();
            }
            return false;
        }
        
        if (WalletState.isConnecting) {
            return false;
        }
        
        WalletState.isConnecting = true;
        this.updateConnectButton();
        
        try {
            // Add Secret Network to Keplr if needed
            await this.addSecretNetworkToKeplr();
            
            const chainId = KEPLR_CHAIN_CONFIG.chainId;
            
            // Enable Secret Network in Keplr
            console.log('Enabling Keplr for chain:', chainId);
            await window.keplr.enable(chainId);
            
            // Get the offline signer
            console.log('Getting offline signer...');
            const offlineSigner = await window.keplr.getOfflineSigner(chainId);
            const accounts = await offlineSigner.getAccounts();
            
            if (accounts.length === 0) {
                throw new Error('No accounts found in Keplr wallet');
            }
            
            // Get EnigmaUtils for encryption/decryption (CRITICAL for Secret Network)
            console.log('Getting EnigmaUtils...');
            const enigmaUtils = window.keplr.getEnigmaUtils(chainId);
            
            // Initialize SecretJS client with proper configuration
            console.log('Initializing SecretNetworkClient...');
            
            // Check if SecretJS is available
            if (typeof SecretNetworkClient === 'undefined') {
                console.error('❌ SecretNetworkClient not available');
                console.error('Available globals:', Object.keys(window).filter(k => k.includes('Secret')));
                throw new Error('SecretJS library not loaded. Please refresh the page and ensure you have internet connectivity.');
            }
            
            const secretjs = new SecretNetworkClient({
                url: KEPLR_CHAIN_CONFIG.rest,
                chainId: chainId,
                wallet: offlineSigner,
                walletAddress: accounts[0].address,
                encryptionUtils: enigmaUtils // CRITICAL: This enables proper Secret Network encryption
            });
            
            // Store references
            WalletState.secretjs = secretjs;
            WalletState.offlineSigner = offlineSigner;
            WalletState.enigmaUtils = enigmaUtils;
            WalletState.connected = true;
            WalletState.address = accounts[0].address;
            
            // Save connection state
            localStorage.setItem('secretgptee-wallet-address', accounts[0].address);
            localStorage.setItem('secretgptee-wallet-connected', 'true');
            
            // Update chat state with verification
            if (window.ChatState) {
                window.ChatState.walletConnected = true;
                window.ChatState.walletAddress = accounts[0].address;
                console.log('✅ ChatState updated with wallet info:', {
                    connected: window.ChatState.walletConnected,
                    address: window.ChatState.walletAddress
                });

                // Trigger a sync to ensure chat knows about wallet
                if (window.syncWalletWithChat) {
                    window.syncWalletWithChat();
                }
            } else {
                console.error('❌ ChatState not available! Wallet info not synced with chat');
            }
            
            console.log('✅ Wallet connected:', accounts[0].address);
            if (showMessages) {
                SecretGPTee.showToast('Wallet connected successfully', 'success');
            }
            
            // Try to get balance
            try {
                await this.refreshBalance();
            } catch (balanceError) {
                console.warn('Balance refresh failed:', balanceError);
                WalletState.balance = { amount: '0' };
            }

            // Load viewing keys for SNIP-20 tokens
            try {
                await this.loadAllViewingKeys();
            } catch (viewingKeyError) {
                console.warn('Failed to load viewing keys:', viewingKeyError);
            }

            this.updateUI();
            return true;
            
        } catch (error) {
            console.error('Wallet connection failed:', error);
            
            if (showMessages) {
                let errorMsg = 'Failed to connect wallet';
                let troubleshooting = '';
                
                if (error.message.includes('Request rejected') || error.message.includes('rejected')) {
                    errorMsg = 'Connection rejected by user';
                    troubleshooting = 'Please try connecting again and approve the request in Keplr.';
                } else if (error.message.includes('SecretJS library not loaded')) {
                    errorMsg = 'SecretJS library failed to load';
                    troubleshooting = 'Please refresh the page and check your internet connection.';
                } else if (error.message.includes('No accounts')) {
                    errorMsg = 'No accounts found in Keplr';
                    troubleshooting = 'Please create or import an account in your Keplr wallet.';
                } else if (error.message.includes('already exists') || error.message.includes('already added')) {
                    errorMsg = 'Chain configuration issue';
                    troubleshooting = 'The Secret Network chain is already configured. Please try connecting again.';
                } else if (error.message.includes('fetch') || error.message.includes('network')) {
                    errorMsg = 'Network connection failed';
                    troubleshooting = 'Please check your internet connection and try again.';
                } else if (error.message.includes('User denied') || error.message.includes('denied')) {
                    errorMsg = 'Access denied by user';
                    troubleshooting = 'Please approve the connection request in Keplr wallet.';
                } else if (error.message.includes('timeout')) {
                    errorMsg = 'Connection timeout';
                    troubleshooting = 'The connection took too long. Please try again.';
                } else {
                    errorMsg = `Connection failed: ${error.message}`;
                    troubleshooting = 'Please make sure Keplr is installed and unlocked, then try again.';
                }
                
                SecretGPTee.showToast(errorMsg, 'error');
                if (troubleshooting) {
                    console.log('💡 Troubleshooting:', troubleshooting);
                }
            }
            
            WalletState.connected = false;
            WalletState.address = null;
            WalletState.secretjs = null;
            return false;
            
        } finally {
            WalletState.isConnecting = false;
            this.updateConnectButton();
        }
    },
    
    // Add Secret Network to Keplr
    async addSecretNetworkToKeplr() {
        try {
            await window.keplr.experimentalSuggestChain(KEPLR_CHAIN_CONFIG);
            console.log('✅ Secret Network configuration suggested to Keplr');
        } catch (error) {
            // Chain might already be added
            if (!error.message.includes('already added')) {
                console.warn('Failed to suggest chain to Keplr:', error);
            }
        }
    },
    
    // Disconnect wallet
    disconnectWallet() {
        WalletState.connected = false;
        WalletState.address = null;
        WalletState.balance = null;
        WalletState.secretjs = null;
        WalletState.offlineSigner = null;
        WalletState.enigmaUtils = null;
        
        // Clear saved state
        localStorage.removeItem('secretgptee-wallet-address');
        localStorage.removeItem('secretgptee-wallet-connected');
        
        // Update chat state
        if (window.ChatState) {
            window.ChatState.walletConnected = false;
            window.ChatState.walletAddress = null;
        }
        
        console.log('🔌 Wallet disconnected');
        SecretGPTee.showToast('Wallet disconnected', 'info');
        
        this.updateUI();
    },
    
    // Refresh wallet balance using SecretJS
    async refreshBalance() {
        if (!WalletState.connected || !WalletState.address || !WalletState.secretjs) {
            return;
        }
        
        try {
            const refreshBtn = document.getElementById('refresh-balance-btn');
            if (refreshBtn) {
                refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                refreshBtn.disabled = true;
            }
            
            // Query balance using SecretJS
            console.log('Querying balance for:', WalletState.address);
            const balance = await WalletState.secretjs.query.bank.balance({
                address: WalletState.address,
                denom: 'uscrt'
            });
            
            console.log('Balance response:', balance);
            WalletState.balance = balance.balance || { amount: '0', denom: 'uscrt' };
            
            this.updateBalanceDisplay();
            this.updateSidebar();
            
        } catch (error) {
            console.error('Balance refresh failed:', error);
            
            // Try backend fallback
            try {
                const response = await fetch(`/secret_gptee/api/wallet/balance/${WalletState.address}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        WalletState.balance = data.balance;
                    }
                }
            } catch (backendError) {
                console.error('Backend balance query also failed:', backendError);
                WalletState.balance = { amount: '0' };
            }
            
            this.updateBalanceDisplay();
            this.updateSidebar();
            
        } finally {
            const refreshBtn = document.getElementById('refresh-balance-btn');
            if (refreshBtn) {
                refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
                refreshBtn.disabled = false;
            }
        }
    },
    
    // Send SCRT transaction using SecretJS
    async sendTransaction(recipientAddress, amount, memo = '') {
        if (!WalletState.connected || !WalletState.secretjs) {
            throw new Error('Wallet not connected');
        }
        
        try {
            console.log('Preparing transaction with SecretJS...');
            console.log('From:', WalletState.address);
            console.log('To:', recipientAddress);
            console.log('Amount:', amount, 'SCRT');
            
            // Convert SCRT to uscrt
            const amountUscrt = scrtToUscrt(amount);
            console.log('Amount in uscrt:', amountUscrt);
            
            // Check if MsgSend is available
            if (typeof MsgSend === 'undefined') {
                // Fallback: use the message constructor from SecretJS
                console.log('Using SecretJS tx.bank.send method...');
                
                // This will trigger Keplr popup automatically
                const tx = await WalletState.secretjs.tx.bank.send(
                    {
                        from_address: WalletState.address,
                        to_address: recipientAddress,
                        amount: stringToCoins(amountUscrt),
                    },
                    {
                        gasLimit: 50_000,
                        gasPriceInFeeDenom: 0.025,
                        feeDenom: 'uscrt',
                        memo: memo
                    }
                );
                
                console.log('Transaction result:', tx);
                
                if (tx.code === 0) {
                    return {
                        success: true,
                        txHash: tx.transactionHash,
                        height: tx.height,
                        gasUsed: tx.gasUsed,
                        gasWanted: tx.gasWanted
                    };
                } else {
                    throw new Error(`Transaction failed with code ${tx.code}: ${tx.rawLog}`);
                }
                
            } else {
                // Use MsgSend directly
                console.log('Creating MsgSend message...');
                
                const msg = new MsgSend({
                    from_address: WalletState.address,
                    to_address: recipientAddress,
                    amount: stringToCoins(amountUscrt)
                });
                
                console.log('Broadcasting transaction with SecretJS...');
                console.log('This will trigger Keplr popup for approval...');
                
                // This will trigger Keplr popup automatically
                const tx = await WalletState.secretjs.tx.broadcast([msg], {
                    gasLimit: 50_000,
                    gasPriceInFeeDenom: 0.025,
                    feeDenom: 'uscrt',
                    memo: memo
                });
                
                console.log('Transaction result:', tx);
                
                if (tx.code === 0) {
                    return {
                        success: true,
                        txHash: tx.transactionHash,
                        height: tx.height,
                        gasUsed: tx.gasUsed,
                        gasWanted: tx.gasWanted
                    };
                } else {
                    throw new Error(`Transaction failed with code ${tx.code}: ${tx.rawLog}`);
                }
            }
            
        } catch (error) {
            console.error('Transaction failed:', error);
            
            // Provide specific error messages for common transaction failures
            if (error.message.includes('rejected') || error.message.includes('Request rejected')) {
                throw new Error('Transaction rejected by user in Keplr wallet');
            } else if (error.message.includes('insufficient funds') || error.message.includes('insufficient coins')) {
                throw new Error('Insufficient SCRT balance to complete transaction');
            } else if (error.message.includes('invalid sequence') || error.message.includes('account sequence mismatch')) {
                throw new Error('Account sequence error. Please try the transaction again.');
            } else if (error.message.includes('gas') && error.message.includes('exceed')) {
                throw new Error('Transaction requires more gas than estimated. Please try again.');
            } else if (error.message.includes('invalid address') || error.message.includes('decoding bech32 failed')) {
                throw new Error('Invalid recipient address format');
            } else if (error.message.includes('timeout') || error.message.includes('deadline exceeded')) {
                throw new Error('Transaction timeout. Please check network connection and try again.');
            } else if (error.message.includes('network') || error.message.includes('fetch')) {
                throw new Error('Network error. Please check your connection and try again.');
            } else if (error.message.includes('memo too large')) {
                throw new Error('Transaction memo is too long. Please use a shorter memo.');
            } else {
                // Log full error for debugging but provide user-friendly message
                console.error('Full transaction error:', error);
                throw new Error(`Transaction failed: ${error.message || 'Unknown error occurred'}`);
            }
        }
    },
    
    // Refresh connection status
    async refreshConnection() {
        if (WalletState.connected) {
            await this.connectWallet(false);
        }
    },
    
    // Update UI elements
    updateUI() {
        this.updateWalletStatus();
        this.updateConnectButton();
        this.updateWalletInfo();
        this.updateBalanceDisplay();
        this.updateSidebar();
    },
    
    // Update wallet status indicator
    updateWalletStatus() {
        const statusElement = document.getElementById('wallet-status');
        if (statusElement) {
            if (WalletState.connected) {
                statusElement.innerHTML = `
                    <span class="status-dot connected"></span>
                    <span>Keplr Connected</span>
                `;
                statusElement.className = 'wallet-status connected';
            } else if (!WalletState.keplrInstalled) {
                statusElement.innerHTML = `
                    <span class="status-dot error"></span>
                    <span>Keplr Not Installed</span>
                `;
                statusElement.className = 'wallet-status error';
            } else {
                statusElement.innerHTML = `
                    <span class="status-dot disconnected"></span>
                    <span>Keplr Disconnected</span>
                `;
                statusElement.className = 'wallet-status disconnected';
            }
        }
    },
    
    // Update connect button
    updateConnectButton() {
        const connectBtn = document.getElementById('wallet-connect-btn');
        const statusSpan = document.getElementById('wallet-status');
        
        if (connectBtn && statusSpan) {
            connectBtn.classList.remove('connecting', 'connected');
            
            if (WalletState.isConnecting) {
                statusSpan.textContent = 'Connecting to Keplr...';
                connectBtn.disabled = true;
                connectBtn.classList.add('connecting');
            } else if (WalletState.connected) {
                statusSpan.textContent = 'Keplr Connected';
                connectBtn.disabled = false;
                connectBtn.classList.add('connected');
            } else if (!WalletState.keplrInstalled) {
                statusSpan.textContent = 'Install Keplr';
                connectBtn.disabled = false;
            } else {
                statusSpan.textContent = 'Connect Keplr';
                connectBtn.disabled = false;
            }
        }
        
        const disconnectBtn = document.getElementById('disconnect-wallet-btn');
        if (disconnectBtn) {
            disconnectBtn.style.display = WalletState.connected ? 'block' : 'none';
        }
    },
    
    // Update wallet info display
    updateWalletInfo() {
        const walletInfo = document.getElementById('wallet-info');
        if (walletInfo) {
            if (WalletState.connected && WalletState.address) {
                walletInfo.innerHTML = `
                    <div class="wallet-address">
                        <label>Address:</label>
                        <span class="address" title="${WalletState.address}">
                            ${this.formatAddress(WalletState.address)}
                        </span>
                        <button class="copy-btn" onclick="WalletInterface.copyAddress()" title="Copy Address">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                `;
                walletInfo.style.display = 'block';
            } else {
                walletInfo.style.display = 'none';
            }
        }
    },
    
    // Update balance display
    updateBalanceDisplay() {
        const balanceElement = document.getElementById('wallet-balance');
        if (balanceElement) {
            if (WalletState.connected && WalletState.balance !== null) {
                const scrtBalance = this.formatBalance(WalletState.balance);
                balanceElement.innerHTML = `
                    <div class="balance-info">
                        <label>Balance:</label>
                        <span class="balance-amount">${scrtBalance} SCRT</span>
                        <button id="refresh-balance-btn" class="refresh-btn" title="Refresh Balance">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                    </div>
                `;
                balanceElement.style.display = 'block';
                
                // Re-attach event listener
                const refreshBtn = document.getElementById('refresh-balance-btn');
                if (refreshBtn) {
                    refreshBtn.addEventListener('click', this.refreshBalance.bind(this));
                }
            } else {
                balanceElement.style.display = 'none';
            }
        }
    },
    
    // Update wallet sidebar
    updateSidebar() {
        this.updateSidebarAddress();
        this.updateSidebarBalance();
    },
    
    // Update sidebar wallet address
    updateSidebarAddress() {
        const sidebarAddress = document.getElementById('sidebar-wallet-address');
        if (sidebarAddress) {
            if (WalletState.connected && WalletState.address) {
                sidebarAddress.textContent = this.formatAddress(WalletState.address);
                sidebarAddress.title = WalletState.address;
            } else {
                sidebarAddress.textContent = 'Not Connected';
                sidebarAddress.title = '';
            }
        }
    },
    
    // Update sidebar balance display
    updateSidebarBalance() {
        const scrtBalanceElement = document.getElementById('scrt-balance');
        if (scrtBalanceElement) {
            if (WalletState.connected && WalletState.balance !== null) {
                const scrtBalance = this.formatBalance(WalletState.balance);
                scrtBalanceElement.textContent = scrtBalance;
            } else if (WalletState.connected) {
                scrtBalanceElement.textContent = '---';
            } else {
                scrtBalanceElement.textContent = '0.000000';
            }
        }
    },
    
    // Format wallet address for display
    formatAddress(address) {
        if (!address) return '';
        return `${address.slice(0, 10)}...${address.slice(-8)}`;
    },
    
    // Format balance for display
    formatBalance(balance) {
        if (!balance) return '0.000000';
        
        // Handle different balance formats
        let amount = '0';
        if (typeof balance === 'object' && balance.amount) {
            amount = balance.amount;
        } else if (typeof balance === 'string') {
            amount = balance;
        }
        
        // Convert from uscrt to SCRT
        const scrtAmount = parseFloat(amount) / 1000000;
        return scrtAmount.toFixed(6);
    },
    
    // Copy address to clipboard
    async copyAddress() {
        if (!WalletState.address) return;
        
        try {
            await navigator.clipboard.writeText(WalletState.address);
            SecretGPTee.showToast('Address copied to clipboard', 'success');
        } catch (error) {
            console.error('Failed to copy address:', error);
            SecretGPTee.showToast('Failed to copy address', 'error');
        }
    },
    
    // Show Keplr installation modal
    showInstallModal() {
        const modal = document.createElement('div');
        modal.className = 'install-modal-overlay';
        modal.innerHTML = `
            <div class="install-modal">
                <div class="modal-header">
                    <h3>Install Keplr Wallet</h3>
                    <button class="close-btn" onclick="this.closest('.install-modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <p>SecretGPTee requires the Keplr wallet extension to connect to the Secret Network.</p>
                    <div class="install-options">
                        <a href="https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap" 
                           target="_blank" class="install-btn chrome">
                            <i class="fab fa-chrome"></i>
                            Install for Chrome
                        </a>
                        <a href="https://addons.mozilla.org/en-US/firefox/addon/keplr/" 
                           target="_blank" class="install-btn firefox">
                            <i class="fab fa-firefox"></i>
                            Install for Firefox
                        </a>
                    </div>
                    <div class="install-note">
                        <i class="fas fa-info-circle"></i>
                        After installing, refresh this page and click "Connect Wallet" again.
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    },

    // Get viewing key for a SNIP-20 token from Keplr
    async getViewingKey(tokenSymbol) {
        try {
            if (!WalletState.connected || !window.keplr) {
                console.warn('Wallet not connected or Keplr not available');
                return null;
            }

            const contractAddress = SNIP20_TOKENS[tokenSymbol.toLowerCase()];
            if (!contractAddress) {
                console.warn(`Token ${tokenSymbol} not found in SNIP20_TOKENS`);
                return null;
            }

            // Try to get viewing key from Keplr
            try {
                const viewingKey = await window.keplr.getSecret20ViewingKey(
                    WalletState.network,
                    contractAddress
                );

                if (viewingKey) {
                    // Store in WalletState
                    WalletState.viewingKeys[tokenSymbol.toLowerCase()] = viewingKey;
                    console.log(`✅ Got viewing key for ${tokenSymbol}`);
                    return viewingKey;
                }
            } catch (error) {
                console.log(`No viewing key found for ${tokenSymbol}, may need to create one`);
                return null;
            }

            return null;
        } catch (error) {
            console.error(`Error getting viewing key for ${tokenSymbol}:`, error);
            return null;
        }
    },

    // Get all viewing keys for common tokens
    async loadAllViewingKeys() {
        if (!WalletState.connected) {
            return;
        }

        console.log('Loading viewing keys from Keplr...');
        const tokens = Object.keys(SNIP20_TOKENS);

        for (const token of tokens) {
            await this.getViewingKey(token);
        }

        console.log('Loaded viewing keys:', Object.keys(WalletState.viewingKeys));
    }
};

// Transaction helper functions
const TransactionHelpers = {
    // Show send transaction modal
    showSendModal() {
        if (!WalletState.connected) {
            SecretGPTee.showToast('Please connect wallet first', 'warning');
            return;
        }
        
        const modal = document.createElement('div');
        modal.className = 'transaction-modal-overlay';
        modal.innerHTML = `
            <div class="transaction-modal" id="send-modal">
                <div class="modal-header">
                    <h3>Send SCRT</h3>
                    <button class="close-btn" onclick="this.closest('.transaction-modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="send-transaction-form">
                        <div class="form-group">
                            <label for="recipient-address">Recipient Address</label>
                            <input type="text" id="recipient-address" placeholder="secret1..." required>
                        </div>
                        <div class="form-group">
                            <label for="send-amount">Amount (SCRT)</label>
                            <input type="number" id="send-amount" step="0.000001" min="0.000001" required>
                            <div class="balance-hint">
                                Available: ${WalletInterface.formatBalance(WalletState.balance)} SCRT
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="transaction-memo">Memo (Optional)</label>
                            <input type="text" id="transaction-memo" placeholder="Transaction memo">
                        </div>
                        <div class="form-actions">
                            <button type="button" class="cancel-btn" onclick="this.closest('.transaction-modal-overlay').remove()">
                                Cancel
                            </button>
                            <button type="submit" class="send-btn">
                                <i class="fas fa-paper-plane"></i> Send SCRT
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Handle form submission
        const form = modal.querySelector('#send-transaction-form');
        form.addEventListener('submit', this.handleSendTransaction.bind(this));
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    },
    
    // Handle send transaction form submission
    async handleSendTransaction(event) {
        event.preventDefault();
        
        const recipientAddress = document.getElementById('recipient-address').value.trim();
        const amount = document.getElementById('send-amount').value.trim();
        const memo = document.getElementById('transaction-memo').value.trim();
        
        // Validate inputs
        if (!WalletInterface.isValidSecretAddress(recipientAddress)) {
            SecretGPTee.showToast('Invalid recipient address', 'error');
            return;
        }
        
        if (!amount || parseFloat(amount) <= 0) {
            SecretGPTee.showToast('Invalid amount', 'error');
            return;
        }
        
        try {
            const sendBtn = document.querySelector('.send-btn');
            sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            sendBtn.disabled = true;
            
            console.log('Initiating transaction...');
            const result = await WalletInterface.sendTransaction(recipientAddress, amount, memo);
            
            if (result.success) {
                SecretGPTee.showToast('Transaction sent successfully!', 'success');
                console.log('Transaction hash:', result.txHash);
                
                // Show transaction details
                const modal = document.querySelector('.transaction-modal');
                if (modal) {
                    const modalContent = modal.querySelector('.modal-body');
                    modalContent.innerHTML = `
                        <div class="transaction-success">
                            <h3><i class="fas fa-check-circle" style="color: #4CAF50;"></i> Transaction Sent!</h3>
                            <div class="transaction-details">
                                <p><strong>Transaction Hash:</strong></p>
                                <p class="tx-hash">${result.txHash}</p>
                                <a href="https://zonescan.io/blockchain/secret/explorer/transactions/${result.txHash}" target="_blank" class="explorer-link">
                                    View on Zonescan <i class="fas fa-external-link-alt"></i>
                                </a>
                            </div>
                        </div>
                    `;
                }
                
                // Auto-close modal after 5 seconds
                setTimeout(() => {
                    document.querySelector('.transaction-modal-overlay')?.remove();
                }, 5000);
                
                // Refresh balance
                setTimeout(() => {
                    WalletInterface.refreshBalance();
                }, 2000);
            }
            
        } catch (error) {
            console.error('Send transaction failed:', error);
            SecretGPTee.showToast(error.message || 'Transaction failed', 'error');
        } finally {
            const sendBtn = document.querySelector('.send-btn');
            if (sendBtn) {
                sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send SCRT';
                sendBtn.disabled = false;
            }
        }
    },
    
    // Validate Secret Network address
    isValidSecretAddress(address) {
        return address && address.startsWith('secret1') && address.length === 45;
    }
};

// Make isValidSecretAddress available on WalletInterface for compatibility
WalletInterface.isValidSecretAddress = TransactionHelpers.isValidSecretAddress;

// Export for global access
window.WalletInterface = WalletInterface;
window.WalletState = WalletState;
window.TransactionHelpers = TransactionHelpers;

// Global functions for HTML onclick handlers
window.toggleWallet = function() {
    console.log('toggleWallet called, connected state:', WalletState.connected);
    
    if (WalletState.connected) {
        // If connected, show wallet sidebar
        toggleWalletSidebar();
    } else {
        // If not connected, try to connect
        WalletInterface.connectWallet().then(success => {
            if (success) {
                // Show sidebar after successful connection
                setTimeout(() => toggleWalletSidebar(), 500);
            }
        });
    }
};

// Initialize wallet interface when called from HTML
window.initializeWallet = function() {
    WalletInterface.init();
};

window.refreshBalance = function() {
    if (WalletState.connected && WalletState.address) {
        WalletInterface.refreshBalance();
    }
};

window.copyWalletAddress = function() {
    WalletInterface.copyAddress();
};

// Wallet sidebar functions
window.toggleWalletSidebar = function() {
    const sidebar = document.getElementById('wallet-sidebar');
    const chatContainer = document.querySelector('.chat-container');
    
    if (sidebar && chatContainer) {
        const isHidden = sidebar.classList.contains('hidden');
        
        if (isHidden) {
            // Show sidebar
            sidebar.classList.remove('hidden');
            chatContainer.style.marginLeft = '320px';
        } else {
            // Hide sidebar
            sidebar.classList.add('hidden');
            chatContainer.style.marginLeft = '0';
        }
    }
};

window.showSendModal = function() {
    TransactionHelpers.showSendModal();
};

window.showReceiveModal = function() {
    if (!WalletState.connected) {
        SecretGPTee.showToast('Please connect wallet first', 'warning');
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'transaction-modal-overlay';
    modal.innerHTML = `
        <div class="transaction-modal">
            <div class="modal-header">
                <h3>Receive SCRT</h3>
                <button class="close-btn" onclick="this.closest('.transaction-modal-overlay').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>Your Secret Network Address</label>
                    <div class="address-box">
                        <span id="receive-address" style="font-family: monospace; word-break: break-all;">${WalletState.address}</span>
                    </div>
                    <div style="margin-top: 1rem; text-align: center;">
                        <button class="send-btn" onclick="copyReceiveAddress()">
                            <i class="fas fa-copy"></i> Copy Address
                        </button>
                    </div>
                </div>
                <div style="margin-top: 1.5rem; padding: 1rem; background: var(--bg-secondary); border-radius: 0.5rem; font-size: 0.9rem; color: var(--text-muted);">
                    <i class="fas fa-info-circle"></i>
                    Share this address to receive SCRT tokens. Only send Secret Network (SCRT) tokens to this address.
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Add copy function to global scope temporarily
    window.copyReceiveAddress = async function() {
        try {
            await navigator.clipboard.writeText(WalletState.address);
            SecretGPTee.showToast('Address copied to clipboard', 'success');
        } catch (error) {
            console.error('Failed to copy address:', error);
            SecretGPTee.showToast('Failed to copy address', 'error');
        }
    };
};

// SNIP Token Manager - handles SNIP-20 token queries and viewing keys
const SNIPTokenManager = {
    // Supported SNIP-20 tokens with contract addresses and metadata
    supportedTokens: {
        'shd': {
            symbol: 'SHD',
            name: 'Shade',
            address: 'secret153wu605vvp934xhd4k9dtd640zsep5jkesstdm',
            decimals: 8,
            codeHash: '638a3e1d50175fbcb8373cf801565283e3eb23d88a9b7b7f99fcc5eb1e6b561e'
        },
        'silk': {
            symbol: 'SILK',
            name: 'Silk',
            address: 'secret1fl449muk5yq8dlad7a22nje4p5d2pnsgymhjfd',
            decimals: 6,
            codeHash: '638a3e1d50175fbcb8373cf801565283e3eb23d88a9b7b7f99fcc5eb1e6b561e'
        },
        'sscrt': {
            symbol: 'sSCRT',
            name: 'Secret SCRT',
            address: 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek',
            decimals: 6,
            codeHash: 'af74387e276be8874f07bec3a87023ee49b0e7ebe08178c49d0a49c3c98ed60e'
        },
        'stkd-scrt': {
            symbol: 'stkd-SCRT',
            name: 'Staked SCRT',
            address: 'secret1k6u0cy4feepm6pehnz804zmwakuwdapm69tuc4',
            decimals: 6,
            codeHash: '638a3e1d50175fbcb8373cf801565283e3eb23d88a9b7b7f99fcc5eb1e6b561e'
        },
        'sinj': {
            symbol: 'sINJ',
            name: 'Secret INJ',
            address: 'secret1cxf4xuy6tcuuykwpcvts2c7g6tghzy2xkrkkgu',
            decimals: 18,
            codeHash: '638a3e1d50175fbcb8373cf801565283e3eb23d88a9b7b7f99fcc5eb1e6b561e'
        },
        'swbtc': {
            symbol: 'sWBTC',
            name: 'Secret WBTC',
            address: 'secret1g7jfnxmxkjgqdts9wlmn238mrzxz5r92zwqv4a',
            decimals: 8,
            codeHash: '638a3e1d50175fbcb8373cf801565283e3eb23d88a9b7b7f99fcc5eb1e6b561e'
        },
        'susdt': {
            symbol: 'sUSDT',
            name: 'Secret USDT',
            address: 'secret18wpjn83dayu4meu6wnn29khfkwdxs7kyrz9c8f',
            decimals: 6,
            codeHash: '638a3e1d50175fbcb8373cf801565283e3eb23d88a9b7b7f99fcc5eb1e6b561e'
        },
        'snobleusdc': {
            symbol: 'snobleUSDC',
            name: 'Secret Noble USDC',
            address: 'secret1vkq022x0q03ung5myy5g4p3yk8y5ch3klx8dpx',
            decimals: 6,
            codeHash: '638a3e1d50175fbcb8373cf801565283e3eb23d88a9b7b7f99fcc5eb1e6b561e'
        }
    },

    /**
     * Create a viewing key for a SNIP-20 token (sends transaction to blockchain)
     * @param {string} tokenSymbol - Token symbol (case-insensitive)
     * @returns {Promise<string|null>} - Created viewing key or null if failed
     */
    async createViewingKey(tokenSymbol) {
        try {
            if (!WalletState.connected || !WalletState.address) {
                console.error('❌ Wallet not connected');
                return null;
            }

            const token = this.supportedTokens[tokenSymbol.toLowerCase()];
            if (!token) {
                console.error(`❌ Token ${tokenSymbol} not supported`);
                return null;
            }

            console.log(`🔨 Creating viewing key for ${token.symbol}...`);

            // Generate random entropy for viewing key
            const entropy = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

            // Create viewing key message
            const msg = {
                create_viewing_key: {
                    entropy: entropy
                }
            };

            // Execute contract (will pop up Keplr for user to sign)
            const tx = await WalletState.secretjs.tx.compute.executeContract(
                {
                    sender: WalletState.address,
                    contract_address: token.address,
                    code_hash: token.codeHash,
                    msg: msg,
                    sent_funds: []
                },
                {
                    gasLimit: 150_000
                }
            );

            if (tx.code !== 0) {
                console.error(`❌ Transaction failed:`, tx.rawLog);
                return null;
            }

            console.log(`✅ Viewing key created for ${token.symbol}`);

            // Parse the viewing key from transaction response
            const viewingKey = this.parseViewingKeyFromTx(tx);
            if (viewingKey) {
                console.log(`🔑 Viewing key: ${viewingKey.substring(0, 10)}...`);
                return viewingKey;
            }

            // If we can't parse it, try to retrieve it from Keplr
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for Keplr to update
            const retrievedKey = await window.keplr.getSecret20ViewingKey(
                WalletState.network,
                token.address
            );

            return retrievedKey;

        } catch (error) {
            console.error(`❌ Error creating viewing key for ${tokenSymbol}:`, error);

            // Check if user rejected
            if (error.message && (error.message.includes('rejected') || error.message.includes('denied') || error.message.includes('Request rejected'))) {
                console.log(`⚠️ User rejected viewing key creation for ${tokenSymbol}`);
            }

            return null;
        }
    },

    /**
     * Parse viewing key from transaction response
     * @param {Object} tx - Transaction response
     * @returns {string|null} - Viewing key or null
     */
    parseViewingKeyFromTx(tx) {
        try {
            // Try to parse from logs
            if (tx.jsonLog && tx.jsonLog[0] && tx.jsonLog[0].events) {
                for (const event of tx.jsonLog[0].events) {
                    if (event.type === 'wasm') {
                        for (const attr of event.attributes) {
                            if (attr.key === 'viewing_key') {
                                return attr.value;
                            }
                        }
                    }
                }
            }

            // Try arrayLog
            if (tx.arrayLog) {
                const viewingKeyAttr = tx.arrayLog
                    .flatMap(log => log.events)
                    .flatMap(event => event.attributes)
                    .find(attr => attr.key === 'viewing_key');

                if (viewingKeyAttr) {
                    return viewingKeyAttr.value;
                }
            }

            return null;
        } catch (error) {
            console.error('Error parsing viewing key from tx:', error);
            return null;
        }
    },

    /**
     * Get viewing key for a SNIP-20 token from Keplr
     * @param {string} tokenSymbol - Token symbol (case-insensitive)
     * @returns {Promise<string|null>} - Viewing key or null if not available
     */
    async getViewingKey(tokenSymbol) {
        try {
            if (!WalletState.connected || !WalletState.address) {
                console.error('❌ Wallet not connected');
                return null;
            }

            const token = this.supportedTokens[tokenSymbol.toLowerCase()];
            if (!token) {
                console.error(`❌ Token ${tokenSymbol} not supported`);
                return null;
            }

            console.log(`🔑 Getting viewing key for ${token.symbol}...`);

            // First, suggest the token to Keplr (ensures Keplr knows about it)
            try {
                await window.keplr.suggestToken(WalletState.network, token.address);
                console.log(`📝 Suggested ${token.symbol} token to Keplr`);
            } catch (suggestError) {
                // Token might already be added, that's OK
                console.log(`ℹ️ Token ${token.symbol} already known to Keplr or suggestion failed`);
            }

            // Try to get existing viewing key from Keplr
            let viewingKey = await window.keplr.getSecret20ViewingKey(
                WalletState.network,
                token.address
            );

            if (viewingKey) {
                console.log(`✅ Retrieved viewing key for ${token.symbol}`);
                return viewingKey;
            }

            // No viewing key exists - create one
            console.log(`⚠️ No viewing key found for ${token.symbol}, creating one...`);

            // Create viewing key via transaction (will pop up Keplr for signing)
            const createdKey = await this.createViewingKey(tokenSymbol);

            if (createdKey) {
                console.log(`✅ Created viewing key for ${token.symbol}`);
                return createdKey;
            }

            console.log(`❌ Failed to create viewing key for ${token.symbol}`);
            return null;

        } catch (error) {
            console.error(`❌ Error getting viewing key for ${tokenSymbol}:`, error);

            // Check if user rejected the transaction
            if (error.message && (error.message.includes('rejected') || error.message.includes('denied'))) {
                console.log(`⚠️ User rejected viewing key creation for ${tokenSymbol}`);
            }

            return null;
        }
    },

    /**
     * Query SNIP-20 token balance using SecretJS in the browser
     * @param {string} tokenSymbol - Token symbol (case-insensitive)
     * @returns {Promise<Object>} - Balance result with success, balance, and formatted fields
     */
    async querySnip20Balance(tokenSymbol) {
        try {
            if (!WalletState.connected || !WalletState.address) {
                return {
                    success: false,
                    error: 'Wallet not connected'
                };
            }

            const token = this.supportedTokens[tokenSymbol.toLowerCase()];
            if (!token) {
                return {
                    success: false,
                    error: `Token ${tokenSymbol} not supported`
                };
            }

            console.log(`💰 Querying ${token.symbol} balance...`);

            // Get viewing key
            const viewingKey = await this.getViewingKey(tokenSymbol);
            if (!viewingKey) {
                return {
                    success: false,
                    error: `No viewing key available for ${token.symbol}`
                };
            }

            // Query balance using SecretJS
            const queryMsg = {
                balance: {
                    address: WalletState.address,
                    key: viewingKey
                }
            };

            const result = await WalletState.secretjs.query.compute.queryContract({
                contract_address: token.address,
                code_hash: this.getCodeHash(token.address),
                query: queryMsg
            });

            const balance = result.balance?.amount || "0";
            const formatted = this.formatBalance(balance, token.decimals);

            console.log(`✅ ${token.symbol} balance: ${formatted}`);

            return {
                success: true,
                balance: balance,
                formatted: formatted,
                token: token.symbol,
                decimals: token.decimals
            };

        } catch (error) {
            console.error(`❌ Error querying ${tokenSymbol} balance:`, error);
            return {
                success: false,
                error: error.message || 'Unknown error'
            };
        }
    },

    /**
     * Format balance with proper decimals
     * @param {string} balance - Raw balance amount
     * @param {number} decimals - Token decimals
     * @returns {string} - Formatted balance
     */
    formatBalance(balance, decimals) {
        try {
            const num = parseFloat(balance) / Math.pow(10, decimals);
            return num.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 6
            });
        } catch (error) {
            console.error('Error formatting balance:', error);
            return '0.00';
        }
    },

    /**
     * Get code hash for a contract address
     * @param {string} contractAddress - Contract address
     * @returns {string|undefined} - Code hash
     */
    getCodeHash(contractAddress) {
        for (const token of Object.values(this.supportedTokens)) {
            if (token.address === contractAddress) {
                return token.codeHash;
            }
        }
        return undefined;
    },

    /**
     * Check if a token is supported
     * @param {string} tokenSymbol - Token symbol
     * @returns {boolean}
     */
    isSupported(tokenSymbol) {
        return tokenSymbol.toLowerCase() in this.supportedTokens;
    },

    /**
     * Get all supported token symbols
     * @returns {string[]}
     */
    getSupportedTokens() {
        return Object.keys(this.supportedTokens).map(key =>
            this.supportedTokens[key].symbol
        );
    }
};

// Make SNIPTokenManager globally available
window.SNIPTokenManager = SNIPTokenManager;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        WalletInterface.init();
    });
} else {
    // DOM is already loaded
    WalletInterface.init();
}