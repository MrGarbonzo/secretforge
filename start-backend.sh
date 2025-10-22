#!/bin/bash

# Start SecretForge Backend for Remote Access

echo "🚀 Starting SecretForge Backend..."

# Get IP address
IP=$(hostname -I | awk '{print $1}')
echo "📡 Your IP address: $IP"

# Navigate to backend
cd "$(dirname "$0")/backend"

# Check if venv exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate venv
source venv/bin/activate

# Check if dependencies installed
if [ ! -f "venv/bin/uvicorn" ]; then
    echo "📦 Installing dependencies..."
    pip install -r requirements.txt
fi

# Check for .env file
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "Creating from .env.example..."
    cp .env.example .env
    echo ""
    echo "❗ IMPORTANT: Edit backend/.env and add your SECRET_AI_API_KEY"
    echo "   Then run this script again."
    exit 1
fi

# Check if API key is set
if grep -q "your_api_key_here" .env; then
    echo "⚠️  Warning: API key not configured!"
    echo "❗ Please edit backend/.env and add your SECRET_AI_API_KEY"
    exit 1
fi

echo ""
echo "✅ Backend starting on http://0.0.0.0:3000"
echo "🌐 Access from remote: http://$IP:3000"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Start server
uvicorn app.main:app --host 0.0.0.0 --port 3000 --reload
