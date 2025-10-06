import React, { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../../store/useChatStore';
import { generateResponse, formatMessagesForGeneration, createUserMessage, createCharacterMessage } from '../../api/chatApi';
import { Send, Square, Paperclip, Mic, MicOff } from 'lucide-react';

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { 
    addMessage, 
    is_generating, 
    setGenerating, 
    current_character,
    model_settings 
  } = useChatStore();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || is_generating || !current_character) return;

    const userMessage = message.trim();
    setMessage('');
    
    // Add user message
    const userMsg = createUserMessage(userMessage, current_character.id);
    addMessage(userMsg);

    // Start generating response
    setGenerating(true);
    
    try {
      console.log('🚀 Generating response for:', current_character.name);
      
      // Get current messages untuk context
      const { messages } = useChatStore.getState();
      const contextMessages = formatMessagesForGeneration([...messages, {
        ...userMsg,
        id: Date.now().toString(),
        timestamp: Date.now()
      }]);
      
      // Generate response menggunakan API
      const response = await generateResponse({
        messages: contextMessages,
        character: current_character,
        settings: model_settings
      });
      
      if (response.success && response.data?.text) {
        console.log('✅ Generated response:', response.data.text.substring(0, 100) + '...');
        
        // Add character response
        const characterMsg = createCharacterMessage(
          response.data.text,
          current_character,
          {
            token_count: response.data.usage?.total_tokens,
            model: response.data.model,
            finish_reason: response.data.finish_reason
          }
        );
        addMessage(characterMsg);
      } else {
        console.error('❌ Failed to generate response:', response.error);
        
        // Add error message
        addMessage(createCharacterMessage(
          `Sorry, I'm having trouble generating a response right now. ${response.error || 'Please try again.'}`,
          current_character,
          { role: 'system' }
        ));
      }
      
    } catch (error: any) {
      console.error('❌ Error generating response:', error);
      
      // Add error message
      let errorMessage = 'Sorry, something went wrong. ';
      
      if (error.message?.includes('Ollama')) {
        errorMessage += 'Please make sure Ollama is running and try again.';
      } else if (error.message?.includes('network')) {
        errorMessage += 'Please check your connection and try again.';
      } else {
        errorMessage += 'Please try again in a moment.';
      }
      
      addMessage(createCharacterMessage(
        errorMessage,
        current_character,
        { role: 'system' }
      ));
    } finally {
      setGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleStopGeneration = () => {
    setGenerating(false);
    // TODO: Implement actual stop generation API call
  };

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording);
    // TODO: Implement voice recording
  };

  const handleAttachment = () => {
    // TODO: Implement file attachment
    console.log('File attachment clicked');
  };

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        {/* Generation indicator */}
        {is_generating && (
          <div className="flex items-center justify-center mb-3">
            <div className="flex items-center space-x-2 px-3 py-2 bg-chimera-light-accent dark:bg-chimera-dark-accent rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-chimera-light-primary dark:bg-chimera-dark-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-chimera-light-primary dark:bg-chimera-dark-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-chimera-light-primary dark:bg-chimera-dark-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              <span className="text-sm text-chimera-light-muted dark:text-chimera-dark-muted">
                {current_character?.name} is typing...
              </span>
              <button
                onClick={handleStopGeneration}
                className="p-1 rounded hover:bg-chimera-light-surface dark:hover:bg-chimera-dark-surface transition-colors"
              >
                <Square className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Input form */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-end space-x-2 p-3 bg-chimera-light-surface dark:bg-chimera-dark-surface border border-chimera-light-accent dark:border-chimera-dark-accent rounded-2xl focus-within:ring-2 focus-within:ring-chimera-light-primary dark:focus-within:ring-chimera-dark-primary focus-within:border-transparent transition-all">
            {/* Attachment button */}
            <button
              type="button"
              onClick={handleAttachment}
              className="p-2 rounded-lg hover:bg-chimera-light-accent dark:hover:bg-chimera-dark-accent transition-colors flex-shrink-0"
              title="Attach file"
            >
              <Paperclip className="w-5 h-5 text-chimera-light-muted dark:text-chimera-dark-muted" />
            </button>

            {/* Text input */}
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${current_character?.name || 'AI'}...`}
              className="flex-1 resize-none bg-transparent border-0 outline-none text-sm leading-relaxed max-h-[120px] min-h-[24px] py-2"
              rows={1}
              disabled={is_generating}
            />

            {/* Voice button */}
            <button
              type="button"
              onClick={handleVoiceToggle}
              className={`
                p-2 rounded-lg transition-colors flex-shrink-0
                ${isRecording 
                  ? 'bg-red-500 text-white' 
                  : 'hover:bg-chimera-light-accent dark:hover:bg-chimera-dark-accent text-chimera-light-muted dark:text-chimera-dark-muted'
                }
              `}
              title={isRecording ? 'Stop recording' : 'Start voice input'}
            >
              {isRecording ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>

            {/* Send button */}
            <button
              type="submit"
              disabled={!message.trim() || is_generating}
              className={`
                p-2 rounded-lg transition-all flex-shrink-0
                ${message.trim() && !is_generating
                  ? 'bg-chimera-light-primary dark:bg-chimera-dark-primary text-white hover:opacity-90 transform hover:scale-105'
                  : 'bg-chimera-light-accent dark:bg-chimera-dark-accent text-chimera-light-muted dark:text-chimera-dark-muted cursor-not-allowed'
                }
              `}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {/* Character counter and settings info */}
          <div className="flex items-center justify-between mt-2 text-xs text-chimera-light-muted dark:text-chimera-dark-muted px-1">
            <div className="flex items-center space-x-3">
              <span>{message.length}/4000</span>
              {model_settings.streaming && (
                <span className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>Streaming</span>
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <span>Temperature: {model_settings.temperature}</span>
              <span>•</span>
              <span>Max tokens: {model_settings.max_tokens}</span>
            </div>
          </div>
        </form>

        {/* Disclaimer */}
        <p className="text-center text-xs text-chimera-light-muted dark:text-chimera-dark-muted mt-3 max-w-2xl mx-auto">
          ChimeraAI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
};

export default ChatInput;