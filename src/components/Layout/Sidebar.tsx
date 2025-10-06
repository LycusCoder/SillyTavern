import React, { useState } from 'react';
import { useChatStore } from '../../store/useChatStore';
import { Plus, MessageSquare, Bot, Search, MoreHorizontal } from 'lucide-react';
import { formatTimestamp, truncateText } from '../../utils/helpers';

const Sidebar: React.FC = () => {
  const { 
    chats, 
    characters, 
    current_chat_id, 
    createNewChat, 
    selectChat, 
    clearCurrentChat 
  } = useChatStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'chats' | 'characters'>('chats');

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCharacters = characters.filter(character =>
    character.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewChat = () => {
    if (characters.length === 0) {
      // TODO: Show character creation modal
      alert('Please create a character first!');
      return;
    }
    
    // For now, use the first character
    createNewChat(characters[0].id);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-chimera-light-accent dark:border-chimera-dark-accent">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-chimera-light-primary dark:bg-chimera-dark-primary text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium">New Chat</span>
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-chimera-light-accent dark:border-chimera-dark-accent">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-chimera-light-muted dark:text-chimera-dark-muted" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-chimera-light-accent dark:bg-chimera-dark-accent rounded-lg border-0 outline-none focus:ring-2 focus:ring-chimera-light-primary dark:focus:ring-chimera-dark-primary text-sm"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-chimera-light-accent dark:border-chimera-dark-accent">
        <button
          onClick={() => setActiveTab('chats')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'chats'
              ? 'text-chimera-light-primary dark:text-chimera-dark-primary border-b-2 border-chimera-light-primary dark:border-chimera-dark-primary'
              : 'text-chimera-light-muted dark:text-chimera-dark-muted hover:text-chimera-light-text dark:hover:text-chimera-dark-text'
          }`}
        >
          Chats
        </button>
        <button
          onClick={() => setActiveTab('characters')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'characters'
              ? 'text-chimera-light-primary dark:text-chimera-dark-primary border-b-2 border-chimera-light-primary dark:border-chimera-dark-primary'
              : 'text-chimera-light-muted dark:text-chimera-dark-muted hover:text-chimera-light-text dark:hover:text-chimera-dark-text'
          }`}
        >
          Characters
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'chats' ? (
          <div className="p-2">
            {filteredChats.length === 0 ? (
              <div className="text-center py-8 text-chimera-light-muted dark:text-chimera-dark-muted">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No chats yet</p>
                <p className="text-xs mt-1">Start a new conversation!</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredChats.map((chat) => {
                  const character = characters.find(c => c.id === chat.character_id);
                  const lastMessage = chat.messages[chat.messages.length - 1];
                  
                  return (
                    <div
                      key={chat.id}
                      onClick={() => selectChat(chat.id)}
                      className={`
                        p-3 rounded-lg cursor-pointer transition-all duration-200 group
                        ${current_chat_id === chat.id
                          ? 'bg-chimera-light-primary dark:bg-chimera-dark-primary text-white'
                          : 'hover:bg-chimera-light-accent dark:hover:bg-chimera-dark-accent'
                        }
                      `}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-chimera-light-secondary dark:bg-chimera-dark-secondary flex items-center justify-center flex-shrink-0">
                            {character?.avatar_url ? (
                              <img src={character.avatar_url} alt={character.name} className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                              <Bot className="w-4 h-4" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{character?.name || 'Unknown'}</p>
                            <p className={`text-xs mt-1 truncate ${
                              current_chat_id === chat.id 
                                ? 'text-white/80' 
                                : 'text-chimera-light-muted dark:text-chimera-dark-muted'
                            }`}>
                              {lastMessage ? truncateText(lastMessage.text, 40) : 'No messages'}
                            </p>
                          </div>
                        </div>
                        <button className={`
                          opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded
                          ${current_chat_id === chat.id ? 'hover:bg-white/20' : 'hover:bg-chimera-light-accent dark:hover:bg-chimera-dark-accent'}
                        `}>
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                      <div className={`text-xs mt-2 ${
                        current_chat_id === chat.id 
                          ? 'text-white/60' 
                          : 'text-chimera-light-muted dark:text-chimera-dark-muted'
                      }`}>
                        {formatTimestamp(new Date(chat.last_message_at).getTime())}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="p-2">
            {filteredCharacters.length === 0 ? (
              <div className="text-center py-8 text-chimera-light-muted dark:text-chimera-dark-muted">
                <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No characters yet</p>
                <p className="text-xs mt-1">Create your first character!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredCharacters.map((character) => (
                  <div
                    key={character.id}
                    className="p-3 rounded-lg hover:bg-chimera-light-accent dark:hover:bg-chimera-dark-accent transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-chimera-light-secondary dark:bg-chimera-dark-secondary flex items-center justify-center flex-shrink-0">
                        {character.avatar_url ? (
                          <img src={character.avatar_url} alt={character.name} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <Bot className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{character.name}</p>
                        <p className="text-xs text-chimera-light-muted dark:text-chimera-dark-muted truncate">
                          {truncateText(character.description, 50)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;