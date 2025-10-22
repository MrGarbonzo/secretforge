# SecretForge Chat Service (Backend)

Privacy-focused AI chat service powered by Secret Network.

## Features

- FastAPI-based REST API
- SecretAI SDK integration for encrypted AI inference
- Simple chat UI included
- Optional chat history (SQLite)
- Health check endpoint
- Docker-ready

## Setup

### Prerequisites

- Python 3.12+
- SecretAI API key (get from https://secretai.scrtlabs.com)

### Installation

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your SECRET_AI_API_KEY
```

### Running Locally

```bash
# Development mode with auto-reload
uvicorn app.main:app --reload

# Production mode
uvicorn app.main:app --host 0.0.0.0 --port 3000
```

Visit http://localhost:3000 for the chat UI.

## API Endpoints

### Health Check
```
GET /api/health
```

Returns service status and configuration.

### Chat
```
POST /api/chat
```

Send a message and get AI response.

**Request Body:**
```json
{
  "message": "Hello!",
  "history": [],
  "stream": false
}
```

**Response:**
```json
{
  "response": "Hello! How can I help you?",
  "timestamp": "2025-10-22T15:30:00"
}
```

## Docker

### Build

```bash
docker build -t secretforge-chat:latest .
```

### Run

```bash
docker run -d \
  -p 3000:3000 \
  -e SECRET_AI_API_KEY=your_key_here \
  -e ENABLE_HISTORY=false \
  -e VM_SIZE=small \
  secretforge-chat:latest
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| SECRET_AI_API_KEY | (required) | Your SecretAI API key |
| ENABLE_HISTORY | false | Enable chat history storage |
| VM_SIZE | small | VM size (small/medium/large) |
| SECRET_NODE_URL | https://lcd.secret.express | Secret Network LCD endpoint |
| SECRET_CHAIN_ID | secret-4 | Secret Network chain ID |
| HOST | 0.0.0.0 | Server host |
| PORT | 3000 | Server port |
| LOG_LEVEL | INFO | Logging level |

## Development

### Running Tests

```bash
pytest
```

### Code Quality

```bash
# Format code
black app/

# Lint
pylint app/

# Type check
mypy app/
```

## Architecture

```
app/
├── main.py           # FastAPI application
├── config.py         # Configuration
├── models.py         # Pydantic models
├── routes/           # API endpoints
│   ├── chat.py
│   └── health.py
├── services/         # Business logic
│   └── secret_ai.py
└── static/           # Chat UI
    ├── index.html
    ├── chat.js
    └── styles.css
```

## License

TBD
