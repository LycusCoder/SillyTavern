#!/usr/bin/env node

/**
 * ChimeraDev Backend Server
 * Modern backend untuk ChimeraAI interface
 * Terintegrasi dengan SillyTavern character system & Ollama
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import charactersRouter from './routes/characters.js';
import chatRouter from './routes/chat.js';
import ollamaRouter from './routes/ollama.js';
import settingsRouter from './routes/settings.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8001;

// Middleware setup
app.use(cors({
    origin: ['http://localhost:3001', 'http://localhost:3000'],
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'ChimeraDev Backend',
        version: '1.0.0'
    });
});

// >>> TAMBAHAN: API Root/Landing Endpoint <<<
// Endpoint ini menjawab permintaan ke /api, yang sebelumnya menghasilkan 404.
app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to ChimeraDev API! Use specific endpoints to interact.',
        available_endpoints: [
            '/api/health (GET)',
            '/api/characters (GET/POST/etc.)',
            '/api/chat (POST)',
            '/api/ollama (POST)',
            '/api/settings (GET/POST)',
        ]
    });
});
// >>> AKHIR TAMBAHAN <<<

// API Routes
app.use('/api/characters', charactersRouter);
app.use('/api/chat', chatRouter);
app.use('/api/ollama', ollamaRouter);
app.use('/api/settings', settingsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        error: true, 
        message: err.message || 'Internal Server Error',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ 
        error: true, 
        message: 'Endpoint not found',
        path: req.originalUrl 
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log('\n🚀 ChimeraDev Backend Server Started!');
    console.log(`📡 Server: http://localhost:${PORT}`);
    console.log(`🔗 API Base: http://localhost:${PORT}/api`);
    console.log(`🎯 Frontend: http://localhost:3001`);
    console.log('✅ Ready to serve ChimeraAI requests!\n');
});

export default app;