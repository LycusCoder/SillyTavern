import React from 'react';
import { useChatStore } from '../../store/useChatStore';
import { 
  MessageSquare, 
  Bot, 
  Zap, 
  Settings, 
  Sparkles,
  ArrowRight,
  Users,
  Cpu
} from 'lucide-react';

const WelcomeScreen: React.FC = () => {
  const { characters, createNewChat, theme } = useChatStore();

  const features = [
    {
      icon: MessageSquare,
      title: 'Modern Chat Interface',
      description: 'Clean, intuitive design inspired by ChatGPT and Gemini'
    },
    {
      icon: Bot,
      title: 'Multiple AI Providers',
      description: 'Support for Ollama, OpenAI, Anthropic, and more'
    },
    {
      icon: Zap,
      title: 'Real-time Streaming',
      description: 'Watch AI responses generate in real-time'
    },
    {
      icon: Settings,
      title: 'Advanced Controls',
      description: 'Fine-tune temperature, tokens, and generation parameters'
    }
  ];

  const handleQuickStart = () => {
    if (characters.length === 0) {
      // TODO: Open character creation modal
      alert('Please create a character first!');
    } else {
      createNewChat(characters[0].id);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl mx-auto text-center">
        {/* Logo and title */}
        <div className="mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-chimera-light-primary to-chimera-light-secondary dark:from-chimera-dark-primary dark:to-chimera-dark-secondary flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-gradient">ChimeraAI</span>
          </h1>
          
          <p className="text-xl text-chimera-light-muted dark:text-chimera-dark-muted leading-relaxed">
            A modern, powerful AI chat interface built for the next generation of AI conversations
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <button
            onClick={handleQuickStart}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-chimera-light-primary dark:bg-chimera-dark-primary text-white rounded-xl hover:opacity-90 transition-all transform hover:scale-105 shadow-lg"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Start Chatting</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button className="flex items-center justify-center space-x-2 px-6 py-3 border border-chimera-light-accent dark:border-chimera-dark-accent rounded-xl hover:bg-chimera-light-accent dark:hover:bg-chimera-dark-accent transition-colors">
            <Users className="w-5 h-5" />
            <span>Create Character</span>
          </button>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl bg-chimera-light-surface dark:bg-chimera-dark-surface border border-chimera-light-accent dark:border-chimera-dark-accent hover:border-chimera-light-primary dark:hover:border-chimera-dark-primary transition-colors"
            >
              <feature.icon className="w-8 h-8 text-chimera-light-primary dark:text-chimera-dark-primary mb-3" />
              <h3 className="font-semibold mb-2 text-chimera-light-text dark:text-chimera-dark-text">
                {feature.title}
              </h3>
              <p className="text-sm text-chimera-light-muted dark:text-chimera-dark-muted leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Status indicators */}
        <div className="flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-chimera-light-muted dark:text-chimera-dark-muted">Backend Connected</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-chimera-light-primary dark:text-chimera-dark-primary" />
            <span className="text-chimera-light-muted dark:text-chimera-dark-muted">
              {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </span>
          </div>
        </div>
        
        {/* Sample characters */}
        {characters.length > 0 && (
          <div className="mt-12">
            <h3 className="text-lg font-semibold mb-4 text-chimera-light-text dark:text-chimera-dark-text">
              Your Characters
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {characters.slice(0, 3).map((character) => (
                <button
                  key={character.id}
                  onClick={() => createNewChat(character.id)}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-chimera-light-accent dark:bg-chimera-dark-accent hover:bg-chimera-light-primary/10 dark:hover:bg-chimera-dark-primary/10 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-chimera-light-secondary dark:bg-chimera-dark-secondary flex items-center justify-center">
                    {character.avatar_url ? (
                      <img src={character.avatar_url} alt={character.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{character.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeScreen;