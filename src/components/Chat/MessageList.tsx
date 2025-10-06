import React, { useEffect, useRef } from 'react';
import { IChatMessage, ICharacter } from '../../types';
import MessageItem from './MessageItem';

interface MessageListProps {
  messages: IChatMessage[];
  character: ICharacter;
}

const MessageList: React.FC<MessageListProps> = ({ messages, character }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-4">
        <div className="w-16 h-16 rounded-full bg-chimera-light-secondary dark:bg-chimera-dark-secondary flex items-center justify-center mb-4">
          {character.avatar_url ? (
            <img 
              src={character.avatar_url} 
              alt={character.name} 
              className="w-16 h-16 rounded-full object-cover" 
            />
          ) : (
            <span className="text-2xl font-bold text-chimera-light-primary dark:text-chimera-dark-primary">
              {character.name.charAt(0)}
            </span>
          )}
        </div>
        
        <h3 className="text-xl font-semibold mb-2 text-chimera-light-text dark:text-chimera-dark-text">
          Start a conversation with {character.name}
        </h3>
        
        <p className="text-chimera-light-muted dark:text-chimera-dark-muted max-w-md mb-6">
          {character.description}
        </p>

        {/* Suggested starters */}
        <div className="grid gap-3 w-full max-w-2xl">
          <button 
            className="p-4 text-left rounded-lg border border-chimera-light-accent dark:border-chimera-dark-accent hover:bg-chimera-light-accent dark:hover:bg-chimera-dark-accent transition-colors"
            onClick={() => {/* TODO: Send suggested message */}}
          >
            <p className="font-medium mb-1">👋 Say hello</p>
            <p className="text-sm text-chimera-light-muted dark:text-chimera-dark-muted">Start with a friendly greeting</p>
          </button>
          
          <button 
            className="p-4 text-left rounded-lg border border-chimera-light-accent dark:border-chimera-dark-accent hover:bg-chimera-light-accent dark:hover:bg-chimera-dark-accent transition-colors"
            onClick={() => {/* TODO: Send suggested message */}}
          >
            <p className="font-medium mb-1">🤔 Ask a question</p>
            <p className="text-sm text-chimera-light-muted dark:text-chimera-dark-muted">Learn more about {character.name}</p>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {messages.map((message, index) => (
          <MessageItem
            key={message.id}
            message={message}
            character={character}
            isFirst={index === 0}
            isLast={index === messages.length - 1}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;