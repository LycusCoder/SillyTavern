import React from 'react';
import { useChatStore } from '../../store/useChatStore';
import { 
  Sliders, 
  Palette, 
  Sun, 
  Moon, 
  Cpu, 
  Zap,
  RotateCcw 
} from 'lucide-react';

const SettingsPanel: React.FC = () => {
  const { 
    theme, 
    setTheme, 
    model_settings, 
    updateModelSettings,
    active_connection 
  } = useChatStore();

  const handleSliderChange = (key: keyof typeof model_settings, value: number) => {
    updateModelSettings({ [key]: value });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-chimera-light-accent dark:border-chimera-dark-accent">
        <div className="flex items-center space-x-2">
          <Sliders className="w-5 h-5 text-chimera-light-primary dark:text-chimera-dark-primary" />
          <h2 className="text-lg font-semibold">Settings</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Theme Section */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Palette className="w-4 h-4 text-chimera-light-muted dark:text-chimera-dark-muted" />
            <h3 className="font-medium">Theme</h3>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setTheme('light')}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-lg transition-all
                ${theme === 'light'
                  ? 'bg-chimera-light-primary text-white shadow-lg'
                  : 'bg-chimera-light-accent dark:bg-chimera-dark-accent hover:bg-chimera-light-primary/10 dark:hover:bg-chimera-dark-primary/10'
                }
              `}
            >
              <Sun className="w-4 h-4" />
              <span className="text-sm">Light</span>
            </button>
            
            <button
              onClick={() => setTheme('dark')}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-lg transition-all
                ${theme === 'dark'
                  ? 'bg-chimera-dark-primary text-white shadow-lg'
                  : 'bg-chimera-light-accent dark:bg-chimera-dark-accent hover:bg-chimera-light-primary/10 dark:hover:bg-chimera-dark-primary/10'
                }
              `}
            >
              <Moon className="w-4 h-4" />
              <span className="text-sm">Dark</span>
            </button>
          </div>
        </div>

        {/* Model Settings */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-chimera-light-muted dark:text-chimera-dark-muted" />
            <h3 className="font-medium">Model Settings</h3>
          </div>

          {/* Active Connection */}
          <div className="p-3 rounded-lg bg-chimera-light-accent dark:bg-chimera-dark-accent">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium">{active_connection?.name}</span>
            </div>
            <p className="text-xs text-chimera-light-muted dark:text-chimera-dark-muted">
              {active_connection?.provider} • {active_connection?.model}
            </p>
          </div>

          {/* Temperature */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Temperature</label>
              <span className="text-xs bg-chimera-light-accent dark:bg-chimera-dark-accent px-2 py-1 rounded">
                {model_settings.temperature}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={model_settings.temperature}
              onChange={(e) => handleSliderChange('temperature', parseFloat(e.target.value))}
              className="w-full h-2 bg-chimera-light-accent dark:bg-chimera-dark-accent rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-chimera-light-muted dark:text-chimera-dark-muted">
              <span>Precise</span>
              <span>Creative</span>
            </div>
          </div>

          {/* Max Tokens */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Max Tokens</label>
              <span className="text-xs bg-chimera-light-accent dark:bg-chimera-dark-accent px-2 py-1 rounded">
                {model_settings.max_tokens}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="4096"
              step="64"
              value={model_settings.max_tokens}
              onChange={(e) => handleSliderChange('max_tokens', parseInt(e.target.value))}
              className="w-full h-2 bg-chimera-light-accent dark:bg-chimera-dark-accent rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Top P */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Top P</label>
              <span className="text-xs bg-chimera-light-accent dark:bg-chimera-dark-accent px-2 py-1 rounded">
                {model_settings.top_p}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={model_settings.top_p}
              onChange={(e) => handleSliderChange('top_p', parseFloat(e.target.value))}
              className="w-full h-2 bg-chimera-light-accent dark:bg-chimera-dark-accent rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Frequency Penalty */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Frequency Penalty</label>
              <span className="text-xs bg-chimera-light-accent dark:bg-chimera-dark-accent px-2 py-1 rounded">
                {model_settings.frequency_penalty}
              </span>
            </div>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={model_settings.frequency_penalty}
              onChange={(e) => handleSliderChange('frequency_penalty', parseFloat(e.target.value))}
              className="w-full h-2 bg-chimera-light-accent dark:bg-chimera-dark-accent rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Streaming Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-chimera-light-muted dark:text-chimera-dark-muted" />
              <span className="text-sm font-medium">Streaming</span>
            </div>
            <button
              onClick={() => updateModelSettings({ streaming: !model_settings.streaming })}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${model_settings.streaming 
                  ? 'bg-chimera-light-primary dark:bg-chimera-dark-primary' 
                  : 'bg-chimera-light-accent dark:bg-chimera-dark-accent'
                }
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${model_settings.streaming ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>

          {/* Reset Button */}
          <button
            onClick={() => updateModelSettings({
              temperature: 0.7,
              max_tokens: 1024,
              top_p: 1.0,
              frequency_penalty: 0,
              presence_penalty: 0,
              streaming: true
            })}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-chimera-light-accent dark:border-chimera-dark-accent rounded-lg hover:bg-chimera-light-accent dark:hover:bg-chimera-dark-accent transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-sm">Reset to Defaults</span>
          </button>
        </div>

        {/* Quick Replies Section (Placeholder) */}
        <div className="space-y-3">
          <h3 className="font-medium">Quick Replies</h3>
          <div className="text-sm text-chimera-light-muted dark:text-chimera-dark-muted">
            Coming soon...
          </div>
        </div>

        {/* Extensions Section (Placeholder) */}
        <div className="space-y-3">
          <h3 className="font-medium">Extensions</h3>
          <div className="text-sm text-chimera-light-muted dark:text-chimera-dark-muted">
            Token Counter, World Info, and more coming soon...
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;