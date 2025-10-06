# 📡 ChimeraDev API Documentation

**Version**: 1.0.0  
**Base URL**: `http://localhost:8001/api`  
**Last Updated**: 6 Oktober 2025

## 🔐 Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible for development purposes.

> **Production Note**: Authentication will be required before production deployment.

## 📋 Response Format

All API responses follow this consistent format:

```json
{
  "success": true|false,
  "data": <response_data>,
  "error": "error_message",
  "message": "additional_info"
}
```

## 🎭 Characters API

### Get All Characters
```http
GET /api/characters
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "char_aria_001",
      "name": "Aria",
      "description": "A friendly AI assistant...",
      "personality": "Enthusiastic, creative...",
      "scenario": "You are chatting with Aria...",
      "first_message": "Hello! I'm Aria...",
      "avatar_url": "/images/characters/aria.png",
      "tags": ["creative", "supportive", "writing"],
      "created_at": "2025-10-06T11:32:19.942Z",
      "updated_at": "2025-10-06T11:32:19.943Z",
      "data": {
        // SillyTavern V2 compatibility fields
      }
    }
  ],
  "count": 2
}
```

### Get Specific Character
```http
GET /api/characters/:id
```

**Parameters:**
- `id` (string): Character ID

**Response:** Single character object

### Create New Character
```http
POST /api/characters
```

**Request Body:**
```json
{
  "name": "Character Name",
  "description": "Character description",
  "personality": "Personality traits", 
  "scenario": "Chat scenario",
  "first_message": "Greeting message",
  "tags": ["tag1", "tag2"]
}
```

**Response:** Created character object

### Update Character
```http
PUT /api/characters/:id
```

**Request Body:** Partial character object with fields to update

**Response:** Updated character object

### Delete Character
```http
DELETE /api/characters/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Character deleted successfully"
}
```

### Get SillyTavern Format
```http
GET /api/characters/:id/sillytavern
```

**Response:** Character in SillyTavern V2 format

## 💬 Chat & Generation API

### Generate AI Response
```http
POST /api/chat/generate
```

**Request Body:**
```json
{
  "messages": [
    {
      "sender": "user",
      "name": "You", 
      "text": "Hello!",
      "is_regenerated": false
    }
  ],
  "character": {
    "id": "char_aria_001",
    "name": "Aria",
    "description": "...",
    // ... other character fields
  },
  "settings": {
    "model": "qwen-local",
    "temperature": 0.7,
    "max_tokens": 1024,
    "top_p": 0.9
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "text": "Generated response text",
    "finish_reason": "stop",
    "model": "qwen-local",
    "usage": {
      "prompt_tokens": 45,
      "completion_tokens": 123,
      "total_tokens": 168
    },
    "metadata": {
      "character_id": "char_aria_001",
      "character_name": "Aria",
      "timestamp": "2025-10-06T11:35:00.000Z"
    }
  }
}
```

### Get Available Models
```http
GET /api/chat/models
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "qwen-local",
      "size": 2048000000,
      "modified_at": "2025-10-06T10:00:00.000Z",
      "digest": "sha256:abc123..."
    }
  ]
}
```

### Test Connection
```http
POST /api/chat/test-connection
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "connected",
    "ollama_url": "http://localhost:11434",
    "available_models": 3,
    "default_model_available": true,
    "models": ["qwen-local", "mistral", "codellama"]
  }
}
```

### Chat Health Check
```http
GET /api/chat/health
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "OK",
    "service": "Chat Service",
    "timestamp": "2025-10-06T11:35:00.000Z",
    "ollama_url": "http://localhost:11434",
    "default_model": "qwen-local"
  }
}
```

## 🤖 Ollama Management API

### Get Ollama Status
```http
GET /api/ollama/status
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "running",
    "url": "http://localhost:11434",
    "total_models": 3,
    "available_models": [
      {
        "name": "qwen-local",
        "size": 2048000000,
        "modified_at": "2025-10-06T10:00:00.000Z"
      }
    ]
  }
}
```

### Get Detailed Models
```http
GET /api/ollama/models
```

**Response:**
```json
{
  "success": true,
  "data": {
    "models": [
      {
        "name": "qwen-local",
        "family": "llama",
        "format": "gguf",
        "size": 2048000000,
        "size_display": "2.0GB",
        "modified_at": "2025-10-06T10:00:00.000Z",
        "digest": "sha256:abc123...",
        "recommended_for": ["general-chat", "creative-writing", "coding"]
      }
    ],
    "grouped": {
      "llama": [...],
      "mistral": [...]
    },
    "total": 3,
    "families": ["llama", "mistral"]
  }
}
```

### Pull/Download Model
```http
POST /api/ollama/pull
```

**Request Body:**
```json
{
  "model_name": "mistral"
}
```

**Response:** Streaming progress updates
```json
{
  "success": true,
  "data": {
    "status": "pulling",
    "digest": "sha256:...",
    "total": 4000000000,
    "completed": 1000000000,
    "progress": 25
  }
}
```

### Delete Model
```http
DELETE /api/ollama/models/:name
```

**Response:**
```json
{
  "success": true,
  "message": "Model mistral deleted successfully"
}
```

### Direct Generation (Testing)
```http
POST /api/ollama/generate
```

**Request Body:**
```json
{
  "model": "qwen-local",
  "prompt": "Hello, how are you?",
  "stream": false
}
```

**Response:** Direct Ollama response object

## ⚙️ Settings API

### Get All Settings
```http
GET /api/settings
```

**Response:**
```json
{
  "success": true,
  "data": {
    "model": {
      "provider": "ollama",
      "name": "qwen-local",
      "temperature": 0.7,
      "max_tokens": 1024,
      "top_p": 0.9,
      "streaming": true
    },
    "ollama": {
      "url": "http://localhost:11434",
      "timeout": 120000
    },
    "ui": {
      "theme": "dark",
      "sidebar_open": true
    },
    "chat": {
      "auto_save": true,
      "show_token_count": true
    },
    "version": "1.0.0",
    "last_updated": "2025-10-06T11:35:00.000Z"
  }
}
```

### Get Settings Category
```http
GET /api/settings/:category
```

**Parameters:**
- `category` (string): model | ollama | ui | chat | character | advanced

**Response:** Specific category settings

### Update All Settings
```http
PUT /api/settings
```

**Request Body:** Settings object (partial updates supported)

### Update Settings Category  
```http
PUT /api/settings/:category
```

**Request Body:** Category-specific settings

### Reset Settings
```http
POST /api/settings/reset
```

**Request Body (optional):**
```json
{
  "categories": ["model", "ui"]
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* reset settings */ },
  "message": "Settings reset successfully"
}
```

### Export Settings
```http
GET /api/settings/export
```

**Response:** Download file dengan settings JSON

### Import Settings
```http
POST /api/settings/import
```

**Request Body:** Settings JSON object

## 🏥 Health & Status

### Server Health
```http
GET /api/health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-10-06T11:35:00.000Z",
  "service": "ChimeraDev Backend", 
  "version": "1.0.0"
}
```

## 🔥 Error Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 201  | Created |
| 400  | Bad Request - Invalid input |
| 404  | Not Found - Resource tidak ada |
| 500  | Internal Server Error |
| 503  | Service Unavailable - Ollama offline |

## 🔍 Example Error Response

```json
{
  "success": false,
  "error": "Character not found",
  "details": {
    "timestamp": "2025-10-06T11:35:00.000Z"
  }
}
```

## 📝 Usage Examples

### Complete Chat Flow
```bash
# 1. Get available characters
curl http://localhost:8001/api/characters

# 2. Test Ollama connection  
curl -X POST http://localhost:8001/api/chat/test-connection

# 3. Generate response
curl -X POST http://localhost:8001/api/chat/generate \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"sender": "user", "text": "Hello!"}],
    "character": {"id": "char_aria_001", "name": "Aria"},
    "settings": {"temperature": 0.7}
  }'
```

### Character Management
```bash
# Create new character
curl -X POST http://localhost:8001/api/characters \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alex",
    "description": "A helpful assistant",
    "first_message": "Hi there!"
  }'

# Update character  
curl -X PUT http://localhost:8001/api/characters/char_alex_001 \
  -H "Content-Type: application/json" \
  -d '{"personality": "Friendly and knowledgeable"}'
```

### Model Management
```bash
# Check available models
curl http://localhost:8001/api/ollama/models

# Download new model
curl -X POST http://localhost:8001/api/ollama/pull \
  -H "Content-Type: application/json" \
  -d '{"model_name": "mistral"}'
```

---

## 🔄 Version History

- **v1.0.0** (6 Oktober 2025): Initial API implementation
  - Character management
  - Chat generation via Ollama
  - Settings persistence
  - Health monitoring

---

*API documentation akan diupdate seiring dengan pengembangan features baru.*