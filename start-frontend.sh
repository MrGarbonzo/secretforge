#!/bin/bash

# Start SecretForge Frontend for Remote Access

echo "🚀 Starting SecretForge Frontend..."

# Get IP address
IP=$(hostname -I | awk '{print $1}')
echo "📡 Your IP address: $IP"

# Navigate to frontend
cd "$(dirname "$0")/frontend"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo ""
echo "✅ Frontend starting on http://0.0.0.0:3000"
echo "🌐 Access from remote: http://$IP:3000"
echo "   (or http://$IP:3001 if backend is using 3000)"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Start dev server with remote access
npm run dev -- -H 0.0.0.0
