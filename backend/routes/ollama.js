/**
 * Ollama Router - ChimeraDev Backend  
 * Dedicated endpoints untuk Ollama integration
 */

import express from 'express';
import axios from 'axios';

const router = express.Router();

const DEFAULT_OLLAMA_URL = 'http://localhost:11434';

// GET /api/ollama/status - Check Ollama status
router.get('/status', async (req, res) => {
    try {
        const response = await axios.get(`${DEFAULT_OLLAMA_URL}/api/tags`, {
            timeout: 5000
        });
        
        const models = response.data.models || [];
        
        res.json({
            success: true,
            data: {
                status: 'running',
                url: DEFAULT_OLLAMA_URL,
                total_models: models.length,
                available_models: models.map(m => ({
                    name: m.name,
                    size: m.size,
                    modified_at: m.modified_at
                }))
            }
        });
        
    } catch (error) {
        console.error('Ollama status check failed:', error);
        
        res.status(503).json({
            success: false,
            data: {
                status: 'offline',
                url: DEFAULT_OLLAMA_URL,
                error: error.code === 'ECONNREFUSED' ? 
                    'Ollama server tidak berjalan' : 
                    error.message
            }
        });
    }
});

// GET /api/ollama/models - Get detailed model list
router.get('/models', async (req, res) => {
    try {
        const response = await axios.get(`${DEFAULT_OLLAMA_URL}/api/tags`);
        
        const models = response.data.models?.map(model => {
            // Parse size untuk display yang lebih baik
            const sizeInMB = model.size ? Math.round(model.size / (1024 * 1024)) : 0;
            const sizeInGB = sizeInMB > 1024 ? (sizeInMB / 1024).toFixed(1) : null;
            
            return {
                name: model.name,
                family: model.details?.family || 'unknown',
                format: model.details?.format || 'unknown',
                size: model.size,
                size_display: sizeInGB ? `${sizeInGB}GB` : `${sizeInMB}MB`,
                modified_at: model.modified_at,
                digest: model.digest,
                // Recommended untuk different use cases
                recommended_for: getModelRecommendation(model.name)
            };
        }) || [];
        
        // Group by family
        const groupedModels = models.reduce((acc, model) => {
            const family = model.family;
            if (!acc[family]) acc[family] = [];
            acc[family].push(model);
            return acc;
        }, {});
        
        res.json({
            success: true,
            data: {
                models,
                grouped: groupedModels,
                total: models.length,
                families: Object.keys(groupedModels)
            }
        });
        
    } catch (error) {
        console.error('Error fetching models:', error);
        res.status(503).json({
            success: false,
            error: 'Failed to fetch models from Ollama'
        });
    }
});

// POST /api/ollama/pull - Pull/download model
router.post('/pull', async (req, res) => {
    const { model_name } = req.body;
    
    if (!model_name) {
        return res.status(400).json({
            success: false,
            error: 'model_name is required'
        });
    }
    
    try {
        // Start pull request
        const response = await axios.post(
            `${DEFAULT_OLLAMA_URL}/api/pull`,
            { name: model_name },
            { 
                timeout: 300000, // 5 menit timeout untuk download
                responseType: 'stream'
            }
        );
        
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        
        // Stream progress updates
        response.data.on('data', (chunk) => {
            const lines = chunk.toString().split('\n').filter(line => line.trim());
            
            for (const line of lines) {
                try {
                    const data = JSON.parse(line);
                    res.write(JSON.stringify({
                        success: true,
                        data: {
                            status: data.status,
                            digest: data.digest,
                            total: data.total,
                            completed: data.completed,
                            progress: data.total ? Math.round((data.completed / data.total) * 100) : 0
                        }
                    }) + '\n');
                } catch (e) {
                    // Skip invalid JSON lines
                }
            }
        });
        
        response.data.on('end', () => {
            res.write(JSON.stringify({
                success: true,
                data: { status: 'success', message: `Model ${model_name} downloaded successfully` }
            }) + '\n');
            res.end();
        });
        
    } catch (error) {
        console.error('Error pulling model:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to pull model',
            details: error.message
        });
    }
});

// DELETE /api/ollama/models/:name - Delete model
router.delete('/models/:name', async (req, res) => {
    const { name } = req.params;
    
    try {
        await axios.delete(`${DEFAULT_OLLAMA_URL}/api/delete`, {
            data: { name }
        });
        
        res.json({
            success: true,
            message: `Model ${name} deleted successfully`
        });
        
    } catch (error) {
        console.error('Error deleting model:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete model',
            details: error.response?.data || error.message
        });
    }
});

// POST /api/ollama/generate - Direct generation (untuk testing)
router.post('/generate', async (req, res) => {
    const { model, prompt, stream = false } = req.body;
    
    if (!model || !prompt) {
        return res.status(400).json({
            success: false,
            error: 'model and prompt are required'
        });
    }
    
    try {
        const response = await axios.post(
            `${DEFAULT_OLLAMA_URL}/api/generate`,
            { model, prompt, stream },
            { timeout: 120000 }
        );
        
        res.json({
            success: true,
            data: response.data
        });
        
    } catch (error) {
        console.error('Error generating:', error);
        res.status(500).json({
            success: false,
            error: 'Generation failed',
            details: error.response?.data || error.message
        });
    }
});

// Helper function untuk model recommendations
function getModelRecommendation(modelName) {
    const name = modelName.toLowerCase();
    
    if (name.includes('llama') && name.includes('3.2')) {
        return ['general-chat', 'creative-writing', 'coding'];
    } else if (name.includes('mistral')) {
        return ['technical-discussion', 'analysis', 'multilingual'];
    } else if (name.includes('codellama') || name.includes('code')) {
        return ['programming', 'code-review', 'debugging'];
    } else if (name.includes('phi')) {
        return ['quick-responses', 'lightweight-chat'];
    } else if (name.includes('gemma')) {
        return ['general-purpose', 'instruction-following'];
    } else {
        return ['general-purpose'];
    }
}

export default router;