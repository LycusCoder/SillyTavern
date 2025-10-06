// Core interfaces for ChimeraAI
export interface ICharacter {
  id: string;
  name: string;
  description: string;
  personality: string;
  scenario: string;
  first_message: string;
  avatar_url?: string;
  greeting?: string;
  created_at: string;
  updated_at: string;
}

export interface IChatMessage {
  id: string;
  sender: 'user' | 'character' | 'system';
  name: string;
  text: string;
  is_regenerated: boolean;
  timestamp: number;
  character_id?: string;
  metadata?: {
    world_info_used?: string[];
    tool_calls?: any[];
    role?: 'system' | 'ooc' | 'main';
    token_count?: number;
  };
}

export interface IChat {
  id: string;
  name: string;
  character_id: string;
  messages: IChatMessage[];
  created_at: string;
  updated_at: string;
  last_message_at: string;
}

export interface IModelSettings {
  temperature: number;
  max_tokens: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  model: string;
  provider: APIProvider;
  streaming: boolean;
}

export type APIProvider = 
  | 'openai' 
  | 'anthropic' 
  | 'ollama'
  | 'textgenerationwebui'
  | 'koboldai'
  | 'novelai'
  | 'custom';

export interface IAPIConnection {
  id: string;
  name: string;
  provider: APIProvider;
  endpoint_url: string;
  api_key?: string;
  model: string;
  is_active: boolean;
  settings: Partial<IModelSettings>;
}

export interface IChatState {
  // Active chat data
  current_chat_id: string | null;
  current_character: ICharacter | null;
  messages: IChatMessage[];
  
  // UI state
  is_generating: boolean;
  is_sidebar_open: boolean;
  is_settings_panel_open: boolean;
  
  // Generation settings
  model_settings: IModelSettings;
  active_connection: IAPIConnection | null;
  
  // Theme
  theme: 'light' | 'dark';
}

export interface IQuickReply {
  id: string;
  label: string;
  message: string;
  is_enabled: boolean;
}

export interface IWorldInfo {
  id: string;
  keys: string[];
  content: string;
  is_enabled: boolean;
  selective: boolean;
  constant: boolean;
}

// API Response types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}