# SecretAI API - Quick Reference

**Official Python SDK for Secret Network AI Services**

---

## 📦 **Installation**

```bash
pip install secret-ai-sdk
```

**Version:** 0.1.5+  
**Python:** 3.12+ recommended

---

## 🔑 **Authentication**

Set your API key as an environment variable:

```bash
export SECRET_AI_API_KEY="your-api-key-here"
```

Get your API key from: https://secretai.scrtlabs.com

---

## 🚀 **Basic Usage**

### **Simple Chat Example**

```python
from secret_ai_sdk.secret_ai import ChatSecret
from secret_ai_sdk.secret import Secret

# 1. Initialize Secret Network client
secret_client = Secret()

# 2. Get available models
models = secret_client.get_models()
print(f"Available: {models}")

# 3. Get service URLs for a model
urls = secret_client.get_urls(model=models[0])

# 4. Create chat client
chat = ChatSecret(
    base_url=urls[0],
    model=models[0],
    temperature=0.7,
    max_tokens=2048
)

# 5. Send a message
messages = [
    ("system", "You are a helpful assistant."),
    ("human", "What is Secret Network?")
]

response = chat.invoke(messages, stream=False)
print(response.content)
```

---

## 🌊 **Streaming Responses**

```python
# Stream responses in real-time
for chunk in chat.stream(messages):
    print(chunk.content, end='', flush=True)
```

---

## ⚙️ **Configuration Options**

### **Secret Network Configuration**

```python
# Custom node configuration
secret_client = Secret(
    chain_id='secret-4',  # or 'pulsar-3' for testnet
    node_url='https://lcd.secret.express'
)

# Or use environment variable
export SECRET_NODE_URL='https://lcd.secret.express'
```

### **Chat Configuration**

```python
chat = ChatSecret(
    base_url=urls[0],
    model=models[0],
    temperature=0.7,      # 0.0-1.0, controls creativity
    max_tokens=2048,      # Maximum response length
    top_p=0.9,           # Nucleus sampling
    frequency_penalty=0,  # Penalize repeated tokens
    presence_penalty=0    # Penalize existing topics
)
```

---

## 🔄 **Error Handling**

### **Exception Hierarchy**

```python
from secret_ai_sdk.secret_ai_ex import (
    SecretAIError,                  # Base exception
    SecretAIAPIKeyMissingError,     # No API key
    SecretAIInvalidInputError,      # Bad input
    SecretAINetworkError,           # Network issues
    SecretAITimeoutError,           # Request timeout
    SecretAIConnectionError,        # Connection failed
    SecretAIRetryExhaustedError,    # Retries failed
    SecretAIResponseError           # Invalid response
)
```

### **Error Handling Example**

```python
try:
    response = chat.invoke(messages)
except SecretAIAPIKeyMissingError:
    print("Error: API key not set")
except SecretAINetworkError as e:
    print(f"Network error: {e}")
except SecretAIError as e:
    print(f"General error: {e}")
```

---

## 🔁 **Retry Logic (Built-in)**

The SDK automatically retries failed requests with exponential backoff:

- **Retryable errors:** Network timeouts, connection errors, temporary server issues
- **Non-retryable errors:** Authentication failures, invalid input, permanent errors
- **Configuration:** Via environment variables

---

## 📝 **Logging**

### **Enable Debug Logging**

```python
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger('secret_ai_sdk')
logger.setLevel(logging.DEBUG)
```

### **Or via Environment**

```bash
export SECRET_SDK_LOG_LEVEL='debug'
```

---

## 💬 **Conversation Management**

### **Building Message History**

```python
# LangChain format: (role, content)
messages = [
    ("system", "You are a helpful assistant."),
    ("human", "What is 2+2?"),
    ("ai", "2+2 equals 4."),
    ("human", "What about 3+3?")
]

response = chat.invoke(messages)
```

### **Message Roles**

- `"system"` - System instructions
- `"human"` - User messages
- `"ai"` - Assistant responses

---

## 🎤 **Voice Features (Bonus)**

### **Speech-to-Text**

```python
from secret_ai_sdk.voice_secret import VoiceSecret

# Get STT service URL
stt_url = secret_client.get_urls(model='stt-whisper')

voice = VoiceSecret(stt_url=stt_url, tts_url=None)

# Transcribe audio
result = voice.transcribe_audio("audio.wav")
print(result['text'])
```

### **Text-to-Speech**

```python
# Get TTS service URL
tts_url = secret_client.get_urls(model='tts-kokoro')

voice = VoiceSecret(stt_url=None, tts_url=tts_url)

# Generate speech
audio = voice.synthesize_speech(
    text="Hello from Secret Network!",
    model="tts-1",
    voice="af_alloy",
    response_format="mp3"
)

# Save audio
voice.save_audio(audio, "output.mp3")
```

---

## 🔗 **Available Models**

Models are retrieved dynamically from smart contracts:

```python
models = secret_client.get_models()
# Returns list like: ['deepseek-v3', 'stt-whisper', 'tts-kokoro', ...]
```

**Model Types:**
- **Text LLMs:** Chat completion, text generation
- **STT Models:** Speech-to-text (Whisper)
- **TTS Models:** Text-to-speech (Kokoro)

---

## 🌐 **OpenAI Compatibility**

The SDK supports Ollama API compatibility and OpenAI-compatible endpoints.

---

## 💡 **Best Practices**

### **1. Always Handle Errors**

```python
try:
    response = chat.invoke(messages)
except SecretAIError as e:
    # Handle gracefully
    pass
```

### **2. Limit Message History**

```python
# Keep only last 10 messages to avoid context limits
messages = conversation_history[-10:] + [("human", new_message)]
```

### **3. Use Context Managers**

```python
# Proper resource management
with ChatSecret(base_url=url, model=model) as chat:
    response = chat.invoke(messages)
```

### **4. Check Initialization**

```python
# Verify client is ready before use
secret_client = Secret()
if not secret_client.get_models():
    raise Exception("Failed to initialize SecretAI")
```

### **5. Set Timeouts**

```python
# Configure request timeouts
chat = ChatSecret(
    base_url=url,
    model=model,
    timeout=30  # seconds
)
```

---

## 🔍 **Troubleshooting**

### **Common Issues**

**"API key not set"**
```bash
# Solution: Set environment variable
export SECRET_AI_API_KEY="your-key"
```

**"No models available"**
```python
# Solution: Check network connectivity
secret_client = Secret(node_url='https://lcd.secret.express')
```

**"Connection timeout"**
```python
# Solution: Increase timeout or retry
chat = ChatSecret(..., timeout=60)
```

**"Invalid response"**
```python
# Solution: Check API key is valid and has credits
# Get new key from https://secretai.scrtlabs.com
```

---

## 📚 **Resources**

- **PyPI:** https://pypi.org/project/secret-ai-sdk/
- **GitHub:** https://github.com/scrtlabs/secret-ai-sdk
- **Docs:** https://docs.scrt.network/secret-network-documentation/secret-ai/
- **Portal:** https://secretai.scrtlabs.com/

---

## 🔐 **Security Notes**

1. **Never commit API keys** to version control
2. **Use environment variables** for sensitive data
3. **Rotate keys regularly** for production apps
4. **Validate user input** before sending to AI
5. **Rate limit** requests in production

---

## 🎯 **Quick Reference Card**

```python
# Install
pip install secret-ai-sdk

# Setup
export SECRET_AI_API_KEY="key"

# Import
from secret_ai_sdk.secret_ai import ChatSecret
from secret_ai_sdk.secret import Secret

# Initialize
client = Secret()
models = client.get_models()
urls = client.get_urls(model=models[0])

# Chat
chat = ChatSecret(base_url=urls[0], model=models[0])
response = chat.invoke([("human", "Hello!")])
print(response.content)

# Error handling
from secret_ai_sdk.secret_ai_ex import SecretAIError
try:
    response = chat.invoke(messages)
except SecretAIError as e:
    print(f"Error: {e}")
```

---

**Last Updated:** October 22, 2025  
**SDK Version:** 0.1.5+
