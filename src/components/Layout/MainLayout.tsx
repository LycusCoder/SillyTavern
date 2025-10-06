import React from 'react';
import { useChatStore } from '../../store/useChatStore';
import Sidebar from './Sidebar';
import ChatArea from '../Chat/ChatArea';
import SettingsPanel from './SettingsPanel';
import { Menu, Settings } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { 
    is_sidebar_open, 
    is_settings_panel_open, 
    toggleSidebar, 
    toggleSettingsPanel,
    theme 
  } = useChatStore();

  return (
    <div className="flex h-screen bg-chimera-light-background dark:bg-chimera-dark-background overflow-hidden">
      {/* Mobile overlay */}
      {is_sidebar_open && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        ${is_sidebar_open ? 'translate-x-0' : '-translate-x-full'}
        fixed lg:relative lg:translate-x-0
        z-50 lg:z-auto
        w-80 lg:w-80
        transition-transform duration-300 ease-in-out
        bg-chimera-light-surface dark:bg-chimera-dark-surface
        border-r border-chimera-light-accent dark:border-chimera-dark-accent
        flex flex-col
        h-full
      `}>
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 border-b border-chimera-light-accent dark:border-chimera-dark-accent bg-chimera-light-background dark:bg-chimera-dark-background flex items-center justify-between px-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-chimera-light-accent dark:hover:bg-chimera-dark-accent transition-colors lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-chimera-light-primary to-chimera-light-secondary dark:from-chimera-dark-primary dark:to-chimera-dark-secondary flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <h1 className="text-xl font-semibold text-gradient">ChimeraAI</h1>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleSettingsPanel}
              className={`
                p-2 rounded-md transition-colors
                ${is_settings_panel_open 
                  ? 'bg-chimera-light-primary dark:bg-chimera-dark-primary text-white' 
                  : 'hover:bg-chimera-light-accent dark:hover:bg-chimera-dark-accent'
                }
              `}
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1">
            <ChatArea />
          </div>

          {/* Settings Panel */}
          <div className={`
            ${is_settings_panel_open ? 'translate-x-0 w-80' : 'translate-x-full w-0'}
            transition-all duration-300 ease-in-out
            bg-chimera-light-surface dark:bg-chimera-dark-surface
            border-l border-chimera-light-accent dark:border-chimera-dark-accent
            overflow-hidden
          `}>
            <SettingsPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;