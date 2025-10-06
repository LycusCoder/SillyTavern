import React from 'react';
import { useChatStore } from '../../store/useChatStore';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import WelcomeScreen from './WelcomeScreen';
import { Bot } from 'lucide-react';

const ChatArea: React.FC = () => {
  const { current_character, messages, current_chat_id } = useChatStore();

  if (!current_chat_id || !current_character) {
    return <WelcomeScreen />;
  }

  return (
    <div className="flex flex-col h-full bg-chimera-light-background dark:bg-chimera-dark-background">
      {/* Chat Header */}
      <div className="flex items-center space-x-3 p-4 border-b border-chimera-light-accent dark:border-chimera-dark-accent bg-chimera-light-surface/50 dark:bg-chimera-dark-surface/50 backdrop-blur-sm">
        <div className="w-10 h-10 rounded-full bg-chimera-light-secondary dark:bg-chimera-dark-secondary flex items-center justify-center flex-shrink-0">
          {current_character.avatar_url ? (
            <img 
              src={current_character.avatar_url} 
              alt={current_character.name} 
              className="w-10 h-10 rounded-full object-cover" 
            />
          ) : (
            <Bot className="w-5 h-5 text-chimera-light-primary dark:text-chimera-dark-primary" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-chimera-light-text dark:text-chimera-dark-text">
            {current_character.name}
          </h2>
          <p className="text-sm text-chimera-light-muted dark:text-chimera-dark-muted truncate">
            {current_character.description}
          </p>
        </div>

        {/* Status indicator */}
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-xs text-chimera-light-muted dark:text-chimera-dark-muted">Online</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} character={current_character} />
      </div>

      {/* Chat Input */}
      <div className="border-t border-chimera-light-accent dark:border-chimera-dark-accent">
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatArea;