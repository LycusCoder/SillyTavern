import React, { useState } from 'react';
import { IChatMessage, ICharacter } from '../../types';
import { formatTimestamp, copyToClipboard } from '../../utils/helpers';
import { 
  Copy, 
  RotateCcw, 
  Edit, 
  Trash2, 
  User, 
  Bot,
  Check,
  MoreHorizontal
} from 'lucide-react';

interface MessageItemProps {
  message: IChatMessage;
  character: ICharacter;
  isFirst: boolean;
  isLast: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, character, isFirst, isLast }) => {
  const [showActions, setShowActions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const isUser = message.sender === 'user';
  const isCharacter = message.sender === 'character';

  const handleCopy = async () => {
    const success = await copyToClipboard(message.text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRegenerate = () => {
    // TODO: Implement message regeneration
    console.log('Regenerate message:', message.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = () => {
    // TODO: Implement message deletion
    console.log('Delete message:', message.id);
  };

  return (
    <div 
      className={`animate-message-in group ${isUser ? 'ml-12' : 'mr-12'}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} space-x-3`}>
        {/* Avatar */}
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-chimera-light-secondary dark:bg-chimera-dark-secondary flex items-center justify-center flex-shrink-0 mt-1">
            {character.avatar_url ? (
              <img 
                src={character.avatar_url} 
                alt={character.name} 
                className="w-8 h-8 rounded-full object-cover" 
              />
            ) : (
              <Bot className="w-4 h-4 text-chimera-light-primary dark:text-chimera-dark-primary" />
            )}
          </div>
        )}

        {/* Message Content */}
        <div className={`flex flex-col max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
          {/* Sender name and timestamp */}
          <div className={`flex items-center space-x-2 mb-1 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <span className="text-sm font-medium text-chimera-light-text dark:text-chimera-dark-text">
              {isUser ? 'You' : character.name}
            </span>
            <span className="text-xs text-chimera-light-muted dark:text-chimera-dark-muted">
              {formatTimestamp(message.timestamp)}
            </span>
            {message.is_regenerated && (
              <span className="text-xs bg-chimera-light-accent dark:bg-chimera-dark-accent px-1.5 py-0.5 rounded text-chimera-light-muted dark:text-chimera-dark-muted">
                Regenerated
              </span>
            )}
          </div>

          {/* Message bubble */}
          <div className={`
            relative px-4 py-3 rounded-2xl max-w-full break-words
            ${isUser 
              ? 'bg-chimera-light-primary dark:bg-chimera-dark-primary text-white' 
              : 'bg-chimera-light-surface dark:bg-chimera-dark-surface border border-chimera-light-accent dark:border-chimera-dark-accent'
            }
            ${isUser ? 'rounded-br-md' : 'rounded-bl-md'}
          `}>
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  className="w-full p-2 rounded bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600 resize-none"
                  defaultValue={message.text}
                  rows={3}
                />
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm">Save</button>
                  <button 
                    className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {message.text}
              </div>
            )}
          </div>

          {/* Message actions */}
          <div className={`
            flex items-center space-x-1 mt-1 transition-opacity duration-200
            ${showActions ? 'opacity-100' : 'opacity-0'}
            ${isUser ? 'flex-row-reverse space-x-reverse' : ''}
          `}>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-md hover:bg-chimera-light-accent dark:hover:bg-chimera-dark-accent transition-colors"
              title="Copy message"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-chimera-light-muted dark:text-chimera-dark-muted" />
              )}
            </button>

            {isCharacter && (
              <button
                onClick={handleRegenerate}
                className="p-1.5 rounded-md hover:bg-chimera-light-accent dark:hover:bg-chimera-dark-accent transition-colors"
                title="Regenerate response"
              >
                <RotateCcw className="w-4 h-4 text-chimera-light-muted dark:text-chimera-dark-muted" />
              </button>
            )}

            <button
              onClick={handleEdit}
              className="p-1.5 rounded-md hover:bg-chimera-light-accent dark:hover:bg-chimera-dark-accent transition-colors"
              title="Edit message"
            >
              <Edit className="w-4 h-4 text-chimera-light-muted dark:text-chimera-dark-muted" />
            </button>

            <button
              onClick={handleDelete}
              className="p-1.5 rounded-md hover:bg-red-500/10 transition-colors"
              title="Delete message"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        </div>

        {/* User avatar */}
        {isUser && (
          <div className="w-8 h-8 rounded-full bg-chimera-light-primary dark:bg-chimera-dark-primary flex items-center justify-center flex-shrink-0 mt-1">
            <User className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      {/* Token count and metadata (if available) */}
      {message.metadata?.token_count && (
        <div className={`flex ${isUser ? 'justify-end mr-11' : 'justify-start ml-11'} mt-1`}>
          <span className="text-xs text-chimera-light-muted dark:text-chimera-dark-muted">
            {message.metadata.token_count} tokens
          </span>
        </div>
      )}
    </div>
  );
};

export default MessageItem;