/**
 * Settings Router - ChimeraDev Backend
 * Mengelola application settings dan preferences
 */

import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Path untuk settings file
const SETTINGS_DIR = path.join(__dirname, '../data');
const SETTINGS_FILE = path.join(SETTINGS_DIR, 'settings.json');

// Default settings
const DEFAULT_SETTINGS = {
    // Model settings
    model: {
        provider: 'ollama',
        name: 'qwen-local',
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 0.9,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        streaming: true
    },
    
    // Ollama connection
    ollama: {
        url: 'http://localhost:11434',
        timeout: 120000,
        auto_download: false
    },
    
    // UI preferences
    ui: {
        theme: 'dark',
        sidebar_open: true,
        settings_panel_open: false,
        chat_bubble_style: 'modern',
        font_size: 'medium',
        animation_speed: 'normal'
    },
    
    // Chat behavior
    chat: {
        auto_save: true,
        show_token_count: true,
        show_typing_indicator: true,
        character_memory_length: 20,
        context_window_size: 4096
    },
    
    // Character settings  
    character: {
        default_personality: 'friendly',
        enable_custom_greetings: true,
        enable_character_expressions: true,
        auto_load_last_character: true
    },
    
    // Advanced settings
    advanced: {
        debug_mode: false,
        log_api_calls: false,
        enable_experimental_features: false,
        cache_responses: true,
        max_cache_size: 100
    },
    
    version: '1.0.0',
    last_updated: new Date().toISOString()
};

// Ensure settings directory exists
if (!fs.existsSync(SETTINGS_DIR)) {
    fs.mkdirSync(SETTINGS_DIR, { recursive: true });
}

// Helper functions
function loadSettings() {
    try {
        if (!fs.existsSync(SETTINGS_FILE)) {
            saveSettings(DEFAULT_SETTINGS);
            return DEFAULT_SETTINGS;
        }
        
        const data = fs.readFileSync(SETTINGS_FILE, 'utf8');
        const settings = JSON.parse(data);
        
        // Merge dengan default untuk handle new settings
        return mergeDeep(DEFAULT_SETTINGS, settings);
        
    } catch (error) {
        console.error('Error loading settings:', error);
        return DEFAULT_SETTINGS;
    }
}

function saveSettings(settings) {
    try {
        settings.last_updated = new Date().toISOString();
        fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
        return settings;
    } catch (error) {
        console.error('Error saving settings:', error);
        throw error;
    }
}

function mergeDeep(target, source) {
    const result = { ...target };
    
    for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            result[key] = mergeDeep(result[key] || {}, source[key]);
        } else {
            result[key] = source[key];
        }
    }
    
    return result;
}

// Routes

// GET /api/settings - Get all settings
router.get('/', (req, res) => {
    try {
        const settings = loadSettings();
        
        res.json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch settings'
        });
    }
});

// GET /api/settings/:category - Get specific settings category
router.get('/:category', (req, res) => {
    try {
        const settings = loadSettings();
        const category = req.params.category;
        
        if (!settings[category]) {
            return res.status(404).json({
                success: false,
                error: `Settings category '${category}' not found`
            });
        }
        
        res.json({
            success: true,
            data: settings[category]
        });
    } catch (error) {
        console.error('Error fetching settings category:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch settings category'
        });
    }
});

// PUT /api/settings - Update all settings
router.put('/', (req, res) => {
    try {
        const currentSettings = loadSettings();
        const updatedSettings = mergeDeep(currentSettings, req.body);
        
        const savedSettings = saveSettings(updatedSettings);
        
        res.json({
            success: true,
            data: savedSettings,
            message: 'Settings updated successfully'
        });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update settings'
        });
    }
});

// PUT /api/settings/:category - Update specific settings category
router.put('/:category', (req, res) => {
    try {
        const settings = loadSettings();
        const category = req.params.category;
        
        if (!settings[category]) {
            return res.status(404).json({
                success: false,
                error: `Settings category '${category}' not found`
            });
        }
        
        // Update specific category
        settings[category] = mergeDeep(settings[category], req.body);
        
        const savedSettings = saveSettings(settings);
        
        res.json({
            success: true,
            data: savedSettings[category],
            message: `Settings category '${category}' updated successfully`
        });
    } catch (error) {
        console.error('Error updating settings category:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update settings category'
        });
    }
});

// POST /api/settings/reset - Reset settings to default
router.post('/reset', (req, res) => {
    try {
        const { categories } = req.body;
        
        if (categories && Array.isArray(categories)) {
            // Reset specific categories
            const settings = loadSettings();
            
            categories.forEach(category => {
                if (DEFAULT_SETTINGS[category]) {
                    settings[category] = { ...DEFAULT_SETTINGS[category] };
                }
            });
            
            const savedSettings = saveSettings(settings);
            
            res.json({
                success: true,
                data: savedSettings,
                message: `Reset categories: ${categories.join(', ')}`
            });
        } else {
            // Reset all settings
            const savedSettings = saveSettings({ ...DEFAULT_SETTINGS });
            
            res.json({
                success: true,
                data: savedSettings,
                message: 'All settings reset to default'
            });
        }
    } catch (error) {
        console.error('Error resetting settings:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to reset settings'
        });
    }
});

// GET /api/settings/export - Export settings
router.get('/export', (req, res) => {
    try {
        const settings = loadSettings();
        
        // Remove sensitive data untuk export
        const exportSettings = { ...settings };
        if (exportSettings.ollama?.api_key) {
            exportSettings.ollama.api_key = '[REDACTED]';
        }
        
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename="chimeradev-settings.json"');
        res.send(JSON.stringify(exportSettings, null, 2));
        
    } catch (error) {
        console.error('Error exporting settings:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to export settings'
        });
    }
});

// POST /api/settings/import - Import settings
router.post('/import', (req, res) => {
    try {
        const importedSettings = req.body;
        
        if (!importedSettings || typeof importedSettings !== 'object') {
            return res.status(400).json({
                success: false,
                error: 'Invalid settings data'
            });
        }
        
        // Validate settings structure
        const validCategories = Object.keys(DEFAULT_SETTINGS);
        const importCategories = Object.keys(importedSettings).filter(key => 
            validCategories.includes(key)
        );
        
        if (importCategories.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No valid settings found to import'
            });
        }
        
        const currentSettings = loadSettings();
        
        // Merge imported settings
        importCategories.forEach(category => {
            currentSettings[category] = mergeDeep(
                currentSettings[category], 
                importedSettings[category]
            );
        });
        
        const savedSettings = saveSettings(currentSettings);
        
        res.json({
            success: true,
            data: savedSettings,
            message: `Imported settings for: ${importCategories.join(', ')}`
        });
        
    } catch (error) {
        console.error('Error importing settings:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to import settings'
        });
    }
});

export default router;