import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
  IChatState, 
  IChatMessage, 
  ICharacter, 
  IChat, 
  IModelSettings, 
  IAPIConnection,
  APIProvider 
} from '../types';

interface ChatStore extends IChatState {
  // State
  chats: IChat[];
  characters: ICharacter[];
  connections: IAPIConnection[];
  
  // Actions
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  toggleSettingsPanel: () => void;
  
  // Chat actions
  createNewChat: (characterId: string) => void;
  selectChat: (chatId: string) => void;
  addMessage: (message: Omit<IChatMessage, 'id' | 'timestamp'>) => void;
  updateMessage: (messageId: string, updates: Partial<IChatMessage>) => void;
  deleteMessage: (messageId: string) => void;
  
  // Character actions
  setCurrentCharacter: (character: ICharacter) => void;
  addCharacter: (character: ICharacter) => void;
  
  // Generation actions
  setGenerating: (isGenerating: boolean) => void;
  updateModelSettings: (settings: Partial<IModelSettings>) => void;
  setActiveConnection: (connection: IAPIConnection) => void;
  
  // Utility actions
  clearCurrentChat: () => void;
  exportChat: (chatId: string) => string;
}

const defaultModelSettings: IModelSettings = {
  temperature: 0.7,
  max_tokens: 1024,
  top_p: 1.0,
  frequency_penalty: 0,
  presence_penalty: 0,
  model: 'gpt-3.5-turbo',
  provider: 'openai',
  streaming: true
};

const defaultConnection: IAPIConnection = {
  id: 'default-ollama',
  name: 'Local Ollama',
  provider: 'ollama',
  endpoint_url: 'http://localhost:11434',
  model: 'llama3.2',
  is_active: true,
  settings: defaultModelSettings
};

export const useChatStore = create<ChatStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        current_chat_id: null,
        current_character: null,
        messages: [],
        chats: [],
        characters: [],
        connections: [defaultConnection],
        
        // UI state
        is_generating: false,
        is_sidebar_open: true,
        is_settings_panel_open: false,
        theme: 'light',
        
        // Settings
        model_settings: defaultModelSettings,
        active_connection: defaultConnection,
        
        // Actions
        setTheme: (theme) => {
          set({ theme });
          document.documentElement.classList.toggle('dark', theme === 'dark');
        },
        
        toggleSidebar: () => set((state) => ({ 
          is_sidebar_open: !state.is_sidebar_open 
        })),
        
        toggleSettingsPanel: () => set((state) => ({ 
          is_settings_panel_open: !state.is_settings_panel_open 
        })),
        
        createNewChat: (characterId) => {
          const character = get().characters.find(c => c.id === characterId);
          if (!character) return;
          
          const chatId = `chat_${Date.now()}`;
          const newChat: IChat = {
            id: chatId,
            name: `Chat with ${character.name}`,
            character_id: characterId,
            messages: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_message_at: new Date().toISOString()
          };
          
          set((state) => ({
            chats: [newChat, ...state.chats],
            current_chat_id: chatId,
            current_character: character,
            messages: []
          }));
        },
        
        selectChat: (chatId) => {
          const chat = get().chats.find(c => c.id === chatId);
          const character = get().characters.find(c => c.id === chat?.character_id);
          
          if (chat && character) {
            set({
              current_chat_id: chatId,
              current_character: character,
              messages: chat.messages
            });
          }
        },
        
        addMessage: (messageData) => {
          const message: IChatMessage = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
            ...messageData
          };
          
          set((state) => {
            const updatedMessages = [...state.messages, message];
            const updatedChats = state.chats.map(chat => 
              chat.id === state.current_chat_id 
                ? { 
                    ...chat, 
                    messages: updatedMessages, 
                    updated_at: new Date().toISOString(),
                    last_message_at: new Date().toISOString()
                  }
                : chat
            );
            
            return {
              messages: updatedMessages,
              chats: updatedChats
            };
          });
        },
        
        updateMessage: (messageId, updates) => {
          set((state) => {
            const updatedMessages = state.messages.map(msg =>
              msg.id === messageId ? { ...msg, ...updates } : msg
            );
            
            const updatedChats = state.chats.map(chat =>
              chat.id === state.current_chat_id
                ? { ...chat, messages: updatedMessages, updated_at: new Date().toISOString() }
                : chat
            );
            
            return {
              messages: updatedMessages,
              chats: updatedChats
            };
          });
        },
        
        deleteMessage: (messageId) => {
          set((state) => {
            const updatedMessages = state.messages.filter(msg => msg.id !== messageId);
            const updatedChats = state.chats.map(chat =>
              chat.id === state.current_chat_id
                ? { ...chat, messages: updatedMessages, updated_at: new Date().toISOString() }
                : chat
            );
            
            return {
              messages: updatedMessages,
              chats: updatedChats
            };
          });
        },
        
        setCurrentCharacter: (character) => {
          set({ current_character: character });
        },
        
        addCharacter: (character) => {
          set((state) => ({
            characters: [character, ...state.characters]
          }));
        },
        
        setGenerating: (isGenerating) => {
          set({ is_generating: isGenerating });
        },
        
        updateModelSettings: (settings) => {
          set((state) => ({
            model_settings: { ...state.model_settings, ...settings }
          }));
        },
        
        setActiveConnection: (connection) => {
          set({ active_connection: connection });
        },
        
        clearCurrentChat: () => {
          set({
            current_chat_id: null,
            current_character: null,
            messages: []
          });
        },
        
        exportChat: (chatId) => {
          const chat = get().chats.find(c => c.id === chatId);
          return JSON.stringify(chat, null, 2);
        }
      }),
      {
        name: 'chimera-chat-store',
        partialize: (state) => ({
          chats: state.chats,
          characters: state.characters,
          connections: state.connections,
          theme: state.theme,
          model_settings: state.model_settings,
          active_connection: state.active_connection
        })
      }
    ),
    {
      name: 'chimera-chat-store'
    }
  )
);