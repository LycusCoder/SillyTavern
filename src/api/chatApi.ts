import { apiCall } from './client';
import { IChatMessage, ICharacter, IModelSettings } from '../types';

export interface GenerateResponse {
  text: string;
  finish_reason?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ChatCompletionRequest {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
    name?: string;
  }>;
  character?: ICharacter;
  settings: IModelSettings;
  stream?: boolean;
}

// Generate AI response
export async function generateResponse(request: ChatCompletionRequest) {
  return apiCall<GenerateResponse>('POST', '/generate', request);
}

// Get available models for current provider
export async function getAvailableModels(provider: string) {
  return apiCall<string[]>('GET', `/models/${provider}`);
}

// Test API connection
export async function testConnection(provider: string, endpoint?: string, apiKey?: string) {
  return apiCall<{ status: string; models?: string[] }>('POST', '/test-connection', {
    provider,
    endpoint,
    apiKey
  });
}

// Get characters from SillyTavern
export async function getCharacters() {
  return apiCall<ICharacter[]>('GET', '/characters');
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
  return apiCall<{ success: boolean }>('DELETE', `/characters/${id}`);
}

// Upload character avatar
export async function uploadAvatar(characterId: string, file: File) {
  const formData = new FormData();
  formData.append('avatar', file);
  
  return apiCall<{ avatar_url: string }>('POST', `/characters/${characterId}/avatar`, formData);
}