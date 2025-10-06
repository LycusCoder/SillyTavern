/**
 * Characters Router - ChimeraDev Backend
 * Mengelola character data terintegrasi dengan SillyTavern format
 */

import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import sanitize from 'sanitize-filename';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Paths untuk character data
const CHARACTERS_DIR = path.join(__dirname, '../data/characters');
const DEFAULT_CHARACTERS_PATH = path.join(__dirname, '../data/default-characters.json');

// Pastikan directory exists
if (!fs.existsSync(CHARACTERS_DIR)) {
    fs.mkdirSync(CHARACTERS_DIR, { recursive: true });
}

// Default character data
const DEFAULT_CHARACTERS = [
    {
        id: 'char_aria_001',
        name: 'Aria',
        description: 'A friendly AI assistant who loves to help with creative writing and brainstorming.',
        personality: 'Enthusiastic, creative, supportive, and always eager to explore new ideas.',
        scenario: 'You are chatting with Aria in a cozy virtual workspace filled with books and creative tools.',
        first_message: "Hello! I'm Aria, your creative companion. I'm here to help you explore ideas, write stories, or just have an engaging conversation. What's on your mind today?",
        avatar_url: '/images/characters/aria.png',
        tags: ['creative', 'supportive', 'writing'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // SillyTavern V2 compatibility
        data: {
            name: 'Aria',
            description: 'A friendly AI assistant who loves to help with creative writing and brainstorming.',
            personality: 'Enthusiastic, creative, supportive, and always eager to explore new ideas.',
            scenario: 'You are chatting with Aria in a cozy virtual workspace filled with books and creative tools.',
            first_mes: "Hello! I'm Aria, your creative companion. I'm here to help you explore ideas, write stories, or just have an engaging conversation. What's on your mind today?",
            mes_example: '<START>\n{{user}}: I want to write a story about space exploration.\n{{char}}: That sounds absolutely fascinating! Space stories offer so many possibilities. Are you thinking more hard science fiction with realistic physics, or perhaps something more fantastical with alien civilizations?\n{{user}}: I\'m leaning towards realistic space exploration.\n{{char}}: Perfect choice! Realistic space exploration can be incredibly compelling. We could explore themes like the psychological challenges of long-distance travel, the technical problems astronauts face, or the wonder of discovering new worlds. What aspect interests you most?',
            creator_notes: 'Aria is designed to be a creative and supportive companion for writing and brainstorming sessions.',
            character_version: '1.0',
            tags: ['creative', 'supportive', 'writing'],
            creator: 'ChimeraDev Team',
            extensions: {
                fav: false,
                talkativeness: 0.7
            }
        }
    },
    {
        id: 'char_nova_001', 
        name: 'Nova',
        description: 'A brilliant scientist AI who specializes in explaining complex topics in simple terms.',
        personality: 'Curious, analytical, patient, and loves sharing knowledge with enthusiasm.',
        scenario: 'You are in Nova\'s research lab, surrounded by fascinating experiments and scientific equipment.',
        first_message: "Greetings! I'm Nova, and I'm absolutely fascinated by the wonders of science and technology. Whether you want to explore the cosmos, understand quantum physics, or just learn something new, I'm here to guide you through it all!",
        avatar_url: '/images/characters/nova.png',
        tags: ['science', 'educational', 'analytical'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // SillyTavern V2 compatibility
        data: {
            name: 'Nova',
            description: 'A brilliant scientist AI who specializes in explaining complex topics in simple terms.',
            personality: 'Curious, analytical, patient, and loves sharing knowledge with enthusiasm.',
            scenario: 'You are in Nova\'s research lab, surrounded by fascinating experiments and scientific equipment.',
            first_mes: "Greetings! I'm Nova, and I'm absolutely fascinated by the wonders of science and technology. Whether you want to explore the cosmos, understand quantum physics, or just learn something new, I'm here to guide you through it all!",
            mes_example: '<START>\n{{user}}: Can you explain black holes?\n{{char}}: Absolutely! Black holes are some of the most extraordinary objects in the universe. Imagine gravity so strong that not even light can escape - that\'s a black hole! They form when massive stars collapse at the end of their lives.\n{{user}}: How do we know they exist if light can\'t escape?\n{{char}}: Excellent question! We can detect them by their gravitational effects on nearby objects. We can see stars orbiting invisible massive objects, or observe the intense radiation from matter spiraling into them before crossing the event horizon.',
            creator_notes: 'Nova is designed to make complex scientific concepts accessible and engaging.',
            character_version: '1.0',
            tags: ['science', 'educational', 'analytical'],
            creator: 'ChimeraDev Team',
            extensions: {
                fav: false,
                talkativeness: 0.8
            }
        }
    }
];

// Helper functions
function loadCharacters() {
    try {
        const files = fs.readdirSync(CHARACTERS_DIR);
        const characters = files
            .filter(file => file.endsWith('.json'))
            .map(file => {
                const filePath = path.join(CHARACTERS_DIR, file);
                const data = fs.readFileSync(filePath, 'utf8');
                return JSON.parse(data);
            });
        
        // Jika tidak ada characters, return default
        if (characters.length === 0) {
            return DEFAULT_CHARACTERS;
        }
        
        return characters;
    } catch (error) {
        console.error('Error loading characters:', error);
        return DEFAULT_CHARACTERS;
    }
}

function saveCharacter(character) {
    const filename = sanitize(character.name) + '_' + character.id + '.json';
    const filePath = path.join(CHARACTERS_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(character, null, 2));
    return character;
}

function convertToSillyTavernFormat(character) {
    return {
        ...character,
        spec: 'chara_card_v2',
        spec_version: '2.0',
        data: {
            name: character.name,
            description: character.description,
            personality: character.personality,
            scenario: character.scenario,
            first_mes: character.first_message,
            mes_example: character.data?.mes_example || '',
            creator_notes: character.data?.creator_notes || '',
            system_prompt: character.data?.system_prompt || '',
            post_history_instructions: character.data?.post_history_instructions || '',
            tags: character.tags || [],
            creator: character.data?.creator || '',
            character_version: character.data?.character_version || '1.0',
            alternate_greetings: character.data?.alternate_greetings || [],
            extensions: {
                fav: character.data?.extensions?.fav || false,
                talkativeness: character.data?.extensions?.talkativeness || 0.5,
                world: character.data?.extensions?.world || '',
                depth_prompt: character.data?.extensions?.depth_prompt || {
                    prompt: '',
                    depth: 4,
                    role: 'system'
                }
            }
        }
    };
}

// Routes

// GET /api/characters - Get all characters
router.get('/', (req, res) => {
    try {
        const characters = loadCharacters();
        res.json({
            success: true,
            data: characters,
            count: characters.length
        });
    } catch (error) {
        console.error('Error fetching characters:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch characters'
        });
    }
});

// GET /api/characters/:id - Get specific character
router.get('/:id', (req, res) => {
    try {
        const characters = loadCharacters();
        const character = characters.find(c => c.id === req.params.id);
        
        if (!character) {
            return res.status(404).json({
                success: false,
                error: 'Character not found'
            });
        }
        
        res.json({
            success: true,
            data: character
        });
    } catch (error) {
        console.error('Error fetching character:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch character'
        });
    }
});

// POST /api/characters - Create new character
router.post('/', (req, res) => {
    try {
        const { name, description, personality, scenario, first_message, tags = [] } = req.body;
        
        if (!name || !description || !first_message) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: name, description, first_message'
            });
        }
        
        const character = {
            id: uuidv4(),
            name: sanitize(name),
            description,
            personality: personality || '',
            scenario: scenario || '',
            first_message,
            avatar_url: `/images/characters/${sanitize(name.toLowerCase())}.png`,
            tags: tags,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            data: {
                name: sanitize(name),
                description,
                personality: personality || '',
                scenario: scenario || '',
                first_mes: first_message,
                mes_example: '',
                creator_notes: '',
                character_version: '1.0',
                tags: tags,
                creator: 'ChimeraDev User',
                extensions: {
                    fav: false,
                    talkativeness: 0.5
                }
            }
        };
        
        const savedCharacter = saveCharacter(character);
        
        res.status(201).json({
            success: true,
            data: savedCharacter
        });
    } catch (error) {
        console.error('Error creating character:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create character'
        });
    }
});

// PUT /api/characters/:id - Update character
router.put('/:id', (req, res) => {
    try {
        const characters = loadCharacters();
        const characterIndex = characters.findIndex(c => c.id === req.params.id);
        
        if (characterIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Character not found'
            });
        }
        
        const existingCharacter = characters[characterIndex];
        const updatedCharacter = {
            ...existingCharacter,
            ...req.body,
            id: req.params.id, // Prevent ID changes
            updated_at: new Date().toISOString()
        };
        
        // Update data field for SillyTavern compatibility
        if (updatedCharacter.data) {
            updatedCharacter.data = {
                ...existingCharacter.data,
                ...req.body.data,
                name: updatedCharacter.name,
                description: updatedCharacter.description,
                personality: updatedCharacter.personality,
                scenario: updatedCharacter.scenario,
                first_mes: updatedCharacter.first_message
            };
        }
        
        const savedCharacter = saveCharacter(updatedCharacter);
        
        res.json({
            success: true,
            data: savedCharacter
        });
    } catch (error) {
        console.error('Error updating character:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update character'
        });
    }
});

// DELETE /api/characters/:id - Delete character
router.delete('/:id', (req, res) => {
    try {
        const characters = loadCharacters();
        const character = characters.find(c => c.id === req.params.id);
        
        if (!character) {
            return res.status(404).json({
                success: false,
                error: 'Character not found'
            });
        }
        
        // Delete file
        const filename = sanitize(character.name) + '_' + character.id + '.json';
        const filePath = path.join(CHARACTERS_DIR, filename);
        
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        
        res.json({
            success: true,
            message: 'Character deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting character:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete character'
        });
    }
});

// GET /api/characters/:id/sillytavern - Get character in SillyTavern format
router.get('/:id/sillytavern', (req, res) => {
    try {
        const characters = loadCharacters();
        const character = characters.find(c => c.id === req.params.id);
        
        if (!character) {
            return res.status(404).json({
                success: false,
                error: 'Character not found'
            });
        }
        
        const stFormat = convertToSillyTavernFormat(character);
        
        res.json({
            success: true,
            data: stFormat
        });
    } catch (error) {
        console.error('Error converting character:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to convert character'
        });
    }
});

export default router;