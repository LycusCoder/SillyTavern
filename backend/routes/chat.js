/**
 * Chat Router - ChimeraDev Backend
 * Mengelola chat conversations dan AI generation
 */

import express from 'express';
import axios from 'axios';

const router = express.Router();

// Default Ollama settings
const DEFAULT_OLLAMA_URL = 'http://localhost:11434';
const DEFAULT_MODEL = 'qwen-local';

// Helper function untuk format message ke Ollama
function formatMessagesForOllama(messages, character) {
    const systemPrompt = character ? 
        `You are ${character.name}. ${character.description}\n\nPersonality: ${character.personality}\n\nScenario: ${character.scenario}\n\nRespond as ${character.name} would, staying in character at all times.` :
        'You are a helpful AI assistant.';
    
    const formattedMessages = [
        {
            role: 'system',
            content: systemPrompt
        }
    ];
    
    // Add conversation history
    messages.forEach(msg => {
        if (msg.sender === 'user') {
            formattedMessages.push({
                role: 'user', 
                content: msg.text
            });
        } else if (msg.sender === 'character') {
            formattedMessages.push({
                role: 'assistant',
                content: msg.text
            });
        }
    });
    
    return formattedMessages;
}

// POST /api/chat/generate - Generate AI response
router.post('/generate', async (req, res) => {
    try {
        const { messages, character, settings = {} } = req.body;
        
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({
                success: false,
                error: 'Messages array is required'
            });
        }
        
        // Format messages untuk Ollama
        const formattedMessages = formatMessagesForOllama(messages, character);
        
        // Ollama request payload
        const ollamaPayload = {
            model: settings.model || DEFAULT_MODEL,
            messages: formattedMessages,
            stream: false,
            options: {
                temperature: settings.temperature || 0.7,
                top_p: settings.top_p || 0.9,
                num_predict: settings.max_tokens || 1024,
                stop: ['<|im_end|>', '</s>', '\n\nUser:', '\n\nHuman:']
            }
        };
        
        console.log('🤖 Sending request to Ollama:', {
            model: ollamaPayload.model,
            messages_count: formattedMessages.length,
            character_name: character?.name || 'None'
        });
        
        // Request ke Ollama
        const ollamaResponse = await axios.post(
            `${DEFAULT_OLLAMA_URL}/api/chat`,
            ollamaPayload,
            {
                timeout: 120000, // 2 menit timeout
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        
        if (!ollamaResponse.data || !ollamaResponse.data.message) {
            throw new Error('Invalid response from Ollama');
        }
        
        const responseText = ollamaResponse.data.message.content.trim();
        
        // Response format
        const response = {
            success: true,
            data: {
                text: responseText,
                finish_reason: 'stop',
                model: ollamaPayload.model,
                usage: {
                    prompt_tokens: ollamaResponse.data.prompt_eval_count || 0,
                    completion_tokens: ollamaResponse.data.eval_count || 0,
                    total_tokens: (ollamaResponse.data.prompt_eval_count || 0) + (ollamaResponse.data.eval_count || 0)
                },
                metadata: {
                    character_id: character?.id,
                    character_name: character?.name,
                    timestamp: new Date().toISOString()
                }
            }
        };
        
        console.log('✅ Generated response:', {
            character: character?.name || 'None',
            response_length: responseText.length,
            tokens_used: response.data.usage.total_tokens
        });
        
        res.json(response);
        
    } catch (error) {
        console.error('❌ Error generating response:', error);
        
        let errorMessage = 'Failed to generate response';
        let statusCode = 500;
        
        if (error.code === 'ECONNREFUSED') {
            errorMessage = 'Ollama server tidak dapat diakses. Pastikan Ollama berjalan di localhost:11434';
            statusCode = 503;
        } else if (error.response?.status === 404) {
            errorMessage = `Model '${DEFAULT_MODEL}' tidak ditemukan di Ollama. Pastikan model sudah didownload.`;
            statusCode = 404;
        } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        res.status(statusCode).json({
            success: false,
            error: errorMessage,
            details: {
                ollama_url: DEFAULT_OLLAMA_URL,
                model: DEFAULT_MODEL,
                timestamp: new Date().toISOString()
            }
        });
    }
});

// GET /api/chat/models - Get available models from Ollama
router.get('/models', async (req, res) => {
    try {
        const response = await axios.get(`${DEFAULT_OLLAMA_URL}/api/tags`);
        
        const models = response.data.models?.map(model => ({
            name: model.name,
            size: model.size,
            modified_at: model.modified_at,
            digest: model.digest
        })) || [];
        
        res.json({
            success: true,
            data: models,
            count: models.length
        });
        
    } catch (error) {
        console.error('Error fetching models:', error);
        
        let errorMessage = 'Failed to fetch models';
        if (error.code === 'ECONNREFUSED') {
            errorMessage = 'Ollama server tidak dapat diakses';
        }
        
        res.status(503).json({
            success: false,
            error: errorMessage,
            details: {
                ollama_url: DEFAULT_OLLAMA_URL
            }
        });
    }
});

// POST /api/chat/test-connection - Test Ollama connection
router.post('/test-connection', async (req, res) => {
    try {
        // Test basic connection
        const response = await axios.get(`${DEFAULT_OLLAMA_URL}/api/tags`);
        
        const models = response.data.models || [];
        const hasDefaultModel = models.some(model => model.name === DEFAULT_MODEL);
        
        res.json({
            success: true,
            data: {
                status: 'connected',
                ollama_url: DEFAULT_OLLAMA_URL,
                available_models: models.length,
                default_model_available: hasDefaultModel,
                models: models.map(m => m.name)
            }
        });
        
    } catch (error) {
        console.error('Connection test failed:', error);
        
        res.status(503).json({
            success: false,
            error: 'Ollama connection failed',
            details: {
                ollama_url: DEFAULT_OLLAMA_URL,
                error_type: error.code || 'unknown'
            }
        });
    }
});

// GET /api/chat/health - Health check for chat service  
router.get('/health', (req, res) => {
    res.json({
        success: true,
        data: {
            status: 'OK',
            service: 'Chat Service',
            timestamp: new Date().toISOString(),
            ollama_url: DEFAULT_OLLAMA_URL,
            default_model: DEFAULT_MODEL
        }
    });
});

export default router;