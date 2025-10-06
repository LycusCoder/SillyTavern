import React, { useEffect, useState } from 'react';
import { useChatStore } from './store/useChatStore';
import { useTheme } from './hooks/useTheme';
import MainLayout from './components/Layout/MainLayout';
import { getCharacters, getOllamaStatus, testConnection } from './api/chatApi';
import { ICharacter } from './types';

function App() {
  const { characters, addCharacter, setGenerating } = useChatStore();
  const [isLoading, setIsLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState<{
    backend: boolean;
    ollama: boolean;
  }>({ backend: false, ollama: false });
  
  useTheme(); // Initialize theme

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setIsLoading(true);
      
      // Check backend connection
      console.log('🔍 Checking ChimeraDev backend connection...');
      
      // Load characters from backend
      const charactersResponse = await getCharacters();
      if (charactersResponse.success && charactersResponse.data) {
        console.log('✅ Loaded characters from backend:', charactersResponse.data.length);
        
        // Clear existing characters and load from backend
        charactersResponse.data.forEach((character: ICharacter) => {
          addCharacter(character);
        });
        
        setBackendStatus(prev => ({ ...prev, backend: true }));
      }
      
      // Check Ollama status
      console.log('🤖 Checking Ollama connection...');
      const ollamaResponse = await getOllamaStatus();
      if (ollamaResponse.success && ollamaResponse.data?.status === 'running') {
        console.log('✅ Ollama is running with', ollamaResponse.data.total_models, 'models');
        setBackendStatus(prev => ({ ...prev, ollama: true }));
      } else {
        console.warn('⚠️ Ollama not available:', ollamaResponse.error);
      }
      
    } catch (error) {
      console.error('❌ Failed to initialize app:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-chimera-light-background dark:bg-chimera-dark-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-chimera-light-primary dark:border-chimera-dark-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="text-chimera-light-text dark:text-chimera-dark-text">
            <h2 className="text-lg font-semibold mb-2">Initializing ChimeraAI...</h2>
            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${backendStatus.backend ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span>Backend Connection</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${backendStatus.ollama ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span>Ollama Integration</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <MainLayout />
      
      {/* Status notification */}
      {!backendStatus.ollama && (
        <div className="fixed bottom-4 right-4 bg-yellow-500 text-white p-3 rounded-lg shadow-lg z-50">
          <div className="text-sm font-medium">Ollama not available</div>
          <div className="text-xs opacity-90">Some features may be limited</div>
        </div>
      )}
    </div>
  );
}

export default App;