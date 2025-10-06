# 🚀 ChimeraDev Setup Guide

**Comprehensive setup guide untuk ChimeraDev backend dan frontend integration**

## 📋 Prerequisites

### System Requirements:
- **Node.js** 18.0.0 atau lebih tinggi
- **yarn** package manager  
- **Git** untuk version control
- **curl** untuk API testing (optional)

### Optional (Recommended):
- **Ollama** untuk AI generation capabilities
- **jq** untuk JSON formatting dalam testing

## 🛠️ Installation Steps

### 1. Repository Setup

Jika belum ada, navigate ke direktori ChimeraDev:
```bash
cd /app/ChimeraDev
```

### 2. Backend Setup

#### Install Backend Dependencies:
```bash
cd backend
yarn install
```

#### Verify Backend Structure:
```bash
# Check if all files are present
ls -la
# Should show: server.js, package.json, routes/, data/
```

#### Start Backend Server:
```bash
# Development mode (recommended)
yarn dev

# Or production mode
yarn start

# Or manual start with custom port
PORT=8001 node server.js
```

#### Verify Backend is Running:
```bash
# Test health endpoint
curl http://localhost:8001/api/health

# Expected response:
# {"status":"OK","timestamp":"...","service":"ChimeraDev Backend","version":"1.0.0"}
```

### 3. Frontend Setup

#### Install Frontend Dependencies:
```bash
cd /app/ChimeraDev
yarn install
```

#### Start Development Server:
```bash
# Using yarn (recommended)
yarn dev

# Or direct vite command
./node_modules/.bin/vite --port 3001

# Or manual node command
node node_modules/.bin/vite --port 3001
```

#### Verify Frontend is Running:
```bash
# Check if frontend is accessible
curl -I http://localhost:3001

# Should return: HTTP/1.1 200 OK
```

### 4. Ollama Setup (Optional but Recommended)

#### Install Ollama:
```bash
# Linux/macOS
curl -fsSL https://ollama.ai/install.sh | sh

# Or download from: https://ollama.ai/download
```

#### Start Ollama Service:
```bash
ollama serve
```

#### Download Recommended Model:
```bash
# Download default model (3GB)
ollama pull qwen-local

# Or smaller model for testing (1GB)
ollama pull qwen-local:1b

# Verify installation
ollama list
```

#### Test Ollama Integration:
```bash
# Test through ChimeraDev backend
curl -X POST http://localhost:8001/api/chat/test-connection

# Expected response:
# {"success":true,"data":{"status":"connected",...}}
```

## 🔧 Configuration

### Backend Configuration

#### Environment Variables (.env):
```bash
# Create backend/.env file
cd /app/ChimeraDev/backend
cat > .env << 'EOF'
PORT=8001
OLLAMA_URL=http://localhost:11434
NODE_ENV=development
LOG_LEVEL=debug
EOF
```

#### Custom Settings:
Backend settings dapat dimodifikasi via API atau langsung edit `data/settings.json`:

```json
{
  "model": {
    "provider": "ollama",
    "name": "qwen-local",
    "temperature": 0.7,
    "max_tokens": 1024
  },
  "ollama": {
    "url": "http://localhost:11434",
    "timeout": 120000
  }
}
```

### Frontend Configuration

#### Vite Proxy Configuration:
File `vite.config.ts` sudah dikonfigurasi untuk proxy ke backend:

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:8001',
    changeOrigin: true,
    secure: false
  }
}
```

## ✅ Verification & Testing

### 1. Backend Health Check:
```bash
# Test all major endpoints
curl http://localhost:8001/api/health
curl http://localhost:8001/api/characters
curl http://localhost:8001/api/settings
curl http://localhost:8001/api/ollama/status
```

### 2. Frontend Integration Test:
```bash
# Test API proxy through frontend
curl http://localhost:3001/api/characters

# Should return same data as direct backend call
```

### 3. Complete Flow Test:
```bash
# Test chat generation (requires Ollama)
curl -X POST http://localhost:8001/api/chat/generate \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"sender": "user", "text": "Hello!", "name": "You", "is_regenerated": false}],
    "character": {
      "id": "char_aria_001",
      "name": "Aria",
      "description": "A friendly AI assistant"
    },
    "settings": {
      "model": "qwen-local",
      "temperature": 0.7,
      "max_tokens": 100
    }
  }'
```

## 🚨 Troubleshooting

### Backend Issues

#### "Port already in use" Error:
```bash
# Check what's using the port
netstat -tlnp | grep :8001

# Kill process if needed
pkill -f "node server.js"

# Or use different port
PORT=8002 node server.js
```

#### "Cannot find module" Error:
```bash
# Reinstall dependencies
rm -rf node_modules yarn.lock
yarn install
```

#### Backend Won't Start:
```bash
# Check logs
cd /app/ChimeraDev/backend
tail -f backend.log

# Common fixes:
node --version  # Should be 18+
yarn --version  # Should be installed
```

### Frontend Issues

#### "vite: command not found":
```bash
# Use direct path
./node_modules/.bin/vite --version

# Or global install
npm install -g vite
```

#### Frontend Won't Load:
```bash
# Check Vite logs
cd /app/ChimeraDev
tail -f vite.log

# Common fixes:
rm -rf node_modules yarn.lock
yarn install
```

#### API Calls Failing:
```bash
# Verify backend is running
curl http://localhost:8001/api/health

# Check proxy configuration
grep -A 10 "proxy" vite.config.ts

# Test direct vs proxied calls
curl http://localhost:8001/api/characters  # Direct
curl http://localhost:3001/api/characters  # Proxied
```

### Ollama Issues

#### Ollama Connection Failed:
```bash
# Check if Ollama is running
ps aux | grep ollama

# Start Ollama service
ollama serve

# Test direct Ollama connection
curl http://localhost:11434/api/tags
```

#### Model Not Found:
```bash
# List available models
ollama list

# Download missing model
ollama pull qwen-local

# Verify in ChimeraDev
curl http://localhost:8001/api/ollama/models
```

## 🔄 Development Workflow

### Daily Development:
```bash
# 1. Start backend
cd /app/ChimeraDev/backend && yarn dev &

# 2. Start frontend  
cd /app/ChimeraDev && yarn dev &

# 3. Start Ollama (if available)
ollama serve &

# 4. Verify everything is running
curl http://localhost:8001/api/health
curl http://localhost:3001/api/characters
```

### Making Changes:

#### Backend Changes:
- Edit files in `backend/` directory
- Server will auto-restart (if using `yarn dev`)
- Test API endpoints after changes

#### Frontend Changes:
- Edit files in `src/` directory  
- Vite will hot-reload automatically
- Check browser console for errors

#### Character Changes:
- Add new characters via API or edit `backend/data/default-characters.json`
- Characters will be available immediately

### Stopping Services:
```bash
# Stop all Node processes
pkill -f node

# Or stop specific processes
pkill -f "vite"
pkill -f "server.js"
pkill -f "ollama"
```

## 📊 Performance Tips

### Development Optimization:
- **Use `yarn dev`** instead of `yarn start` untuk hot reload
- **Keep Ollama running** untuk faster AI responses
- **Use smaller models** (1b) untuk development, larger (3b+) untuk production
- **Monitor memory usage** jika menggunakan multiple models

### Production Considerations:
- Set `NODE_ENV=production`
- Use process manager seperti PM2
- Configure reverse proxy (Nginx/Apache)
- Set up proper logging dan monitoring
- Use database instead of file storage

## 🎯 Next Steps

After successful setup:

1. **Explore the UI** at http://localhost:3001
2. **Test character interactions** dengan different personalities
3. **Experiment dengan model settings** untuk optimal responses
4. **Read API documentation** di `/docs/API_DOCUMENTATION.md`
5. **Customize characters** untuk specific use cases

## 📋 Quick Reference

### Service URLs:
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:8001/api
- **Ollama**: http://localhost:11434
- **Health Check**: http://localhost:8001/api/health

### Key Commands:
```bash
# Backend
cd /app/ChimeraDev/backend && yarn dev

# Frontend  
cd /app/ChimeraDev && yarn dev

# Ollama
ollama serve
ollama pull qwen-local

# Testing
curl http://localhost:8001/api/health
```

### Important Files:
- `backend/server.js` - Main backend server
- `src/App.tsx` - Main frontend component
- `backend/data/settings.json` - Application settings
- `vite.config.ts` - Frontend build configuration

---

**Setup complete! 🎉 ChimeraDev should now be fully functional dengan modern backend dan beautiful frontend interface.**