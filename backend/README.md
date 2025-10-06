# ChimeraDev Backend

Backend server modern untuk ChimeraAI interface yang terintegrasi dengan SillyTavern character system dan Ollama.

## 🚀 Features

- **Character System**: Kompatibel dengan format SillyTavern V2
- **Ollama Integration**: Dukungan lengkap untuk model lokal
- **Modern API**: RESTful API dengan error handling yang robust
- **Hot Reload**: Development server dengan auto-restart
- **Settings Management**: Persistent configuration system

## 📋 Requirements

- **Node.js** 18+ 
- **Ollama** running di localhost:11434
- **yarn** package manager

## 🛠️ Installation & Setup

### 1. Install Dependencies

```bash
cd /app/ChimeraDev/backend
yarn install
```

### 2. Pastikan Ollama Berjalan

```bash
# Check Ollama status
ollama list

# Jika belum ada model, download model default
ollama pull qwen-local
```

### 3. Start Backend Server

```bash
# Development mode dengan hot reload
yarn dev

# Production mode
yarn start
```

## 📡 API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Characters
- `GET /api/characters` - Get all characters
- `GET /api/characters/:id` - Get specific character  
- `POST /api/characters` - Create new character
- `PUT /api/characters/:id` - Update character
- `DELETE /api/characters/:id` - Delete character
- `GET /api/characters/:id/sillytavern` - Get character dalam format SillyTavern

### Chat & Generation
- `POST /api/chat/generate` - Generate AI response
- `GET /api/chat/models` - Get available Ollama models
- `POST /api/chat/test-connection` - Test Ollama connection
- `GET /api/chat/health` - Chat service health

### Ollama Management
- `GET /api/ollama/status` - Ollama server status
- `GET /api/ollama/models` - Detailed model information
- `POST /api/ollama/pull` - Download model
- `DELETE /api/ollama/models/:name` - Delete model
- `POST /api/ollama/generate` - Direct Ollama generation

### Settings
- `GET /api/settings` - Get all settings
- `GET /api/settings/:category` - Get settings category
- `PUT /api/settings` - Update settings
- `PUT /api/settings/:category` - Update settings category
- `POST /api/settings/reset` - Reset to defaults
- `GET /api/settings/export` - Export settings
- `POST /api/settings/import` - Import settings

## 📁 Project Structure

```
backend/
├── server.js              # Main server file
├── package.json           # Dependencies & scripts
├── routes/                # API route handlers
│   ├── characters.js      # Character management
│   ├── chat.js           # Chat & AI generation
│   ├── ollama.js         # Ollama integration
│   └── settings.js       # Settings management
└── data/                  # Data storage
    ├── characters/        # Character JSON files
    ├── settings.json      # App settings
    └── default-characters.json
```

## 🎭 Character System

### Format Compatibility

Backend mendukung dua format character:

1. **ChimeraAI Format** - Simplified untuk frontend
2. **SillyTavern V2 Format** - Full compatibility dengan SillyTavern

### Character Fields

```json
{
  "id": "unique_id",
  "name": "Character Name",
  "description": "Character description",
  "personality": "Personality traits",
  "scenario": "Chat scenario context",
  "first_message": "Character's greeting",
  "avatar_url": "/images/characters/name.png",
  "tags": ["tag1", "tag2"],
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z",
  "data": {
    // SillyTavern V2 compatibility fields
    "name": "Character Name",
    "description": "...",
    "personality": "...",
    "scenario": "...",
    "first_mes": "...",
    "mes_example": "Example conversation",
    "creator_notes": "Notes from creator",
    "character_version": "1.0",
    "tags": ["tag1", "tag2"],
    "creator": "Creator Name",
    "extensions": {
      "fav": false,
      "talkativeness": 0.7
    }
  }
}
```

## 🤖 Ollama Integration

### Supported Models

Backend bekerja dengan semua model Ollama yang terinstall:

- **qwen-local** (default) - Balanced performance
- **qwen-local:1b** - Lightweight option
- **mistral** - Technical discussions
- **codellama** - Programming assistance
- **phi** - Quick responses

### Model Management

```bash
# List available models
curl http://localhost:8000/api/ollama/models

# Check Ollama status  
curl http://localhost:8000/api/ollama/status

# Download new model
curl -X POST http://localhost:8000/api/ollama/pull \
  -H "Content-Type: application/json" \
  -d '{"model_name": "mistral"}'
```

## ⚙️ Configuration

### Default Settings

```json
{
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
  }
}
```

### Environment Variables

```env
PORT=8000
OLLAMA_URL=http://localhost:11434
NODE_ENV=development
```

## 🧪 Testing

### Manual Testing

```bash
# Test server health
curl http://localhost:8000/api/health

# Test Ollama connection
curl -X POST http://localhost:8000/api/chat/test-connection

# Get characters
curl http://localhost:8000/api/characters

# Generate response
curl -X POST http://localhost:8000/api/chat/generate \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"sender": "user", "text": "Hello!"}],
    "character": {"id": "char_aria_001", "name": "Aria"},
    "settings": {"model": "qwen-local", "temperature": 0.7}
  }'
```

## 🚨 Troubleshooting

### Common Issues

1. **Ollama Connection Failed**
   ```bash
   # Pastikan Ollama berjalan
   ollama serve
   
   # Check status
   ollama list
   ```

2. **Model Not Found**
   ```bash
   # Download model yang diperlukan
   ollama pull qwen-local
   ```

3. **Port Already in Use**
   ```bash
   # Check process di port 8000
   lsof -i :8000
   
   # Kill process jika perlu
   kill -9 <PID>
   ```

4. **Character Not Loading**
   - Check data/characters/ directory exists
   - Verify JSON format validity
   - Check console logs untuk error details

## 📝 Development

### Adding New Routes

1. Buat file router baru di `routes/`
2. Import dan register di `server.js`
3. Add proper error handling
4. Update API documentation

### Character Extensions

Untuk menambah field character baru:

1. Update `routes/characters.js`
2. Modify default character template
3. Update frontend types di `src/types/index.ts`
4. Test compatibility dengan SillyTavern format

## 📜 License

MIT License - see LICENSE file for details.

---

**Backend ready! 🚀 Frontend dapat mengakses API di `http://localhost:8000/api`**