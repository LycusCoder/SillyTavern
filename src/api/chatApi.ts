import { apiCall } from './client';
import { IChatMessage, ICharacter, IModelSettings } from '../types';

export interface GenerateResponse {
  text: string;
  finish_reason?: string;
  model?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  metadata?: {
    character_id?: string;
    character_name?: string;
    timestamp?: string;
  };
}

export interface ChatCompletionRequest {
  messages: IChatMessage[];
  character?: ICharacter;
  settings?: Partial<IModelSettings>;
}

export interface OllamaModel {
  name: string;
  family?: string;
  format?: string;
  size: number;
  size_display: string;
  modified_at: string;
  digest: string;
  recommended_for: string[];
}

export interface OllamaStatus {
  status: 'running' | 'offline';
  url: string;
  total_models: number;
  available_models: OllamaModel[];
  error?: string;
}

// Generate AI response menggunakan Ollama
export async function generateResponse(request: ChatCompletionRequest) {
  console.log('🤖 Generating response with:', {
    messages_count: request.messages.length,
    character: request.character?.name,
    model: request.settings?.model
  });
  
  return apiCall<GenerateResponse>('POST', '/chat/generate', request);
}

// Get available models from Ollama
export async function getAvailableModels() {
  return apiCall<OllamaModel[]>('GET', '/chat/models');
}

// Test Ollama connection
export async function testConnection() {
  return apiCall<{ status: string; models?: string[] }>('POST', '/chat/test-connection');
}

// Ollama specific endpoints

// Get Ollama status
export async function getOllamaStatus() {
  return apiCall<OllamaStatus>('GET', '/ollama/status');
}

// Get detailed Ollama models
export async function getOllamaModels() {
  return apiCall<{
    models: OllamaModel[];
    grouped: Record<string, OllamaModel[]>;
    total: number;
    families: string[];
  }>('GET', '/ollama/models');
}

// Pull/download Ollama model
export async function pullOllamaModel(modelName: string) {
  return apiCall<{ status: string; message: string }>('POST', '/ollama/pull', {
    model_name: modelName
  });
}

// Delete Ollama model
export async function deleteOllamaModel(modelName: string) {
  return apiCall<{ message: string }>('DELETE', `/ollama/models/${modelName}`);
}

// Direct Ollama generation (untuk testing)
export async function directOllamaGenerate(model: string, prompt: string) {
  return apiCall<any>('POST', '/ollama/generate', {
    model,
    prompt,
    stream: false
  });
}

// Character API endpoints

// Get characters from ChimeraDev backend
export async function getCharacters() {
  return apiCall<ICharacter[]>('GET', '/characters');
}

// Get specific character
export async function getCharacter(id: string) {
  return apiCall<ICharacter>('GET', `/characters/${id}`);
}

// Create new character
export async function createCharacter(character: Omit<ICharacter, 'id' | 'created_at' | 'updated_at'>) {
  return apiCall<ICharacter>('POST', '/characters', character);
}

// Update character
export async function updateCharacter(id: string, character: Partial<ICharacter>) {
  return apiCall<ICharacter>('PUT', `/characters/${id}`, character);
}

// Delete character
export async function deleteCharacter(id: string) {
  return apiCall<{ message: string }>('DELETE', `/characters/${id}`);
}

// Get character in SillyTavern format
export async function getCharacterSillyTavernFormat(id: string) {
  return apiCall<any>('GET', `/characters/${id}/sillytavern`);
}

// Settings API endpoints

// Get all settings
export async function getSettings() {
  return apiCall<any>('GET', '/settings');
}

// Get specific settings category
export async function getSettingsCategory(category: string) {
  return apiCall<any>('GET', `/settings/${category}`);
}

// Update settings
export async function updateSettings(settings: any) {
  return apiCall<any>('PUT', '/settings', settings);
}

// Update specific settings category
export async function updateSettingsCategory(category: string, settings: any) {
  return apiCall<any>('PUT', `/settings/${category}`, settings);
}

// Reset settings
export async function resetSettings(categories?: string[]) {
  return apiCall<any>('POST', '/settings/reset', { categories });
}

// Export settings
export async function exportSettings() {
  return apiCall<any>('GET', '/settings/export');
}

// Import settings
export async function importSettings(settings: any) {
  return apiCall<any>('POST', '/settings/import', settings);
}

// Utility functions untuk message formatting
export function formatMessagesForGeneration(messages: IChatMessage[]): IChatMessage[] {
  return messages.filter(msg => 
    msg.sender === 'user' || msg.sender === 'character'
  ).map(msg => ({
    ...msg,
    text: msg.text.trim()
  }));
}

export function createUserMessage(text: string, characterId?: string): Omit<IChatMessage, 'id' | 'timestamp'> {
  return {
    sender: 'user',
    name: 'You',
    text: text.trim(),
    is_regenerated: false,
    character_id: characterId
  };
}

export function createCharacterMessage(
  text: string, 
  character: ICharacter,
  metadata?: any
): Omit<IChatMessage, 'id' | 'timestamp'> {
  return {
    sender: 'character',
    name: character.name,
    text: text.trim(),
    is_regenerated: false,
    character_id: character.id,
    metadata
  };
}