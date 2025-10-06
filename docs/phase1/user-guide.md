# User Guide - Phase 1

## 🎯 Getting Started

Selamat datang di **ChimeraAI**! Panduan ini akan membantu Anda memahami dan menggunakan semua fitur yang tersedia di Phase 1.

## 🖥️ Interface Overview

### Layout Utama (3-Panel Design)

```
┌─────────────┬──────────────────────┬─────────────┐
│             │                      │             │
│  Sidebar    │     Chat Area        │  Settings   │
│   Left      │      (Main)          │   Panel     │
│             │                      │   (Right)   │
│  - Chats    │  - Messages          │  - Theme    │
│  - Characters│  - Input Box         │  - Models   │
│             │                      │  - Controls │
└─────────────┴──────────────────────┴─────────────┘
```

### Header Bar
- **Logo**: ChimeraAI branding
- **Title**: Current active state
- **Settings Button**: Toggle right panel (⚙️)

## 🏠 Welcome Screen

### Main Features Display
Ketika pertama kali membuka ChimeraAI, Anda akan melihat:

1. **ChimeraAI Logo & Branding**
2. **Quick Action Buttons**:
   - 🔵 **Start Chatting**: Mulai conversation dengan character
   - ⚫ **Create Character**: (Coming in Phase 2)

3. **Feature Showcase Grid**:
   - 💬 **Modern Chat Interface**
   - 🤖 **Multiple AI Providers** 
   - ⚡ **Real-time Streaming**
   - ⚙️ **Advanced Controls**

4. **Status Indicators**:
   - 🟢 **Backend Connected**: SillyTavern status
   - 🌓 **Light/Dark Mode**: Current theme

5. **Your Characters Section**: 
   - Display available characters (Aria, Nova)
   - Quick access untuk start chat

## 💬 Chat Interface

### Starting a Chat

1. **Click "Start Chatting"** dari welcome screen
2. **Auto-select character** (Aria/Nova) untuk Phase 1  
3. **Chat area opens** dengan character header

### Chat Header
```
┌─────────────────────────────────────────────┐
│ [Avatar] Character Name               Online │
│          Character description              │
└─────────────────────────────────────────────┘
```

### Message Area
- **Empty State**: Menampilkan character introduction
- **Suggested Actions**:
  - 👋 Say hello (Start with friendly greeting)  
  - 🤔 Ask a question (Learn more about character)

### Chat Input Box
```
┌─────────────────────────────────────────────┐
│ [📎] Message Character Name...    [🎤] [➤] │
└─────────────────────────────────────────────┘
│ 0/4000  ● Streaming    Temp: 0.7  Max: 1024│
└─────────────────────────────────────────────┘
```

**Input Controls**:
- **📎 Attachment**: File upload (UI ready)
- **🎤 Voice**: Voice input toggle (UI ready)  
- **➤ Send**: Submit message (functional)
- **Character Counter**: 0/4000 limit
- **Settings Display**: Temperature, Max tokens

### Message Bubbles

**User Messages** (Right-aligned, Blue):
```
                    ┌─────────────────┐
                    │ Your message    │ [You]
                    │ content here    │ 
                    └─────────────────┘
                         12:34 PM
```

**Character Messages** (Left-aligned, Gray):
```
[🤖] Character Name                    12:34 PM
┌─────────────────────────────────────────────┐
│ Character response content here             │
│ Multi-line responses supported              │
└─────────────────────────────────────────────┘
```

**Message Actions** (Hover to reveal):
- 📋 **Copy**: Copy message text
- 🔄 **Regenerate**: Generate new response (characters only)
- ✏️ **Edit**: Edit message inline
- 🗑️ **Delete**: Remove message

## 📋 Sidebar Management

### Left Sidebar (Chat List)

#### Header Section
- 🔵 **New Chat Button**: Create new conversation
- 🔍 **Search Box**: "Search chats..."

#### Tabs
- **Chats Tab**: Active conversations
- **Characters Tab**: Available AI personas

#### Chat List (Empty State)
```
┌─────────────────────────────────────┐
│           [💬]                      │
│         No chats yet                │
│    Start a new conversation!        │
└─────────────────────────────────────┘
```

#### Chat List (With Chats)
```
┌─────────────────────────────────────┐
│ [🤖] Character Name        2h ago   │
│      Last message preview...       │
│ ● Selected/Active state            │
└─────────────────────────────────────┘
```

#### Characters Tab
```  
┌─────────────────────────────────────┐
│ [🤖] Aria                          │
│      A friendly AI assistant...    │
├─────────────────────────────────────┤
│ [🔬] Nova                          │
│      A brilliant scientist AI...   │
└─────────────────────────────────────┘
```

**Character Info**:
- **Avatar**: Visual representation
- **Name**: Character identifier  
- **Description**: Brief personality overview
- **Click**: Start new chat dengan character

### Sidebar Responsiveness
- **Desktop**: Persistent sidebar (280px width)
- **Mobile**: Overlay sidebar dengan backdrop
- **Toggle**: Hamburger menu (☰) di header

## ⚙️ Settings Panel

### Access Settings Panel
- **Click**: ⚙️ Settings icon di header kanan
- **Toggle**: Panel slides dari kanan
- **Width**: 320px overlay

### Theme Section
```
🎨 Theme
┌─────────────────────────────────────┐
│ [☀️ Light]  [🌙 Dark]              │
└─────────────────────────────────────┘
```

**Theme Options**:
- **☀️ Light**: Putih background, biru muda accents
- **🌙 Dark**: Abu-abu kehitaman, biru tua cyan accents
- **Persistent**: Tersimpan di localStorage
- **Instant**: Real-time theme switching

### Model Settings Section
```
🖥️ Model Settings

Active Connection:
┌─────────────────────────────────────┐
│ ● Local Ollama                      │
│   ollama • qwen-local                │
└─────────────────────────────────────┘

Temperature                     [0.7]
├────●──────────────────────────────┤
Precise                     Creative

Max Tokens                    [1024] 
├──────────●────────────────────────┤

Top P                         [1.0]
├──────────────────────────●────────┤

Frequency Penalty             [0]
├●──────────────────────────────────┤

⚡ Streaming                    [ON]

[↻ Reset to Defaults]
```

**Controls Available**:
- **Temperature**: 0.0-2.0 (creativity control)
- **Max Tokens**: 1-4096 (response length)  
- **Top P**: 0.0-1.0 (diversity control)
- **Frequency Penalty**: -2.0 to 2.0 (repetition control)
- **Streaming Toggle**: Enable/disable real-time responses
- **Reset Button**: Restore default values

### Extensions Section (Phase 2 Preview)
```
🧩 Extensions

Quick Replies: Coming soon...
Token Counter, World Info, and more coming soon...
```

## 🎨 Theme System

### Light Mode
- **Background**: Clean white (#FFFFFF)
- **Surface**: Subtle gray (#F8FAFC)  
- **Primary**: Bright blue (#3B82F6)
- **Text**: Dark gray (#1E293B)
- **Accents**: Light blue tones

### Dark Mode  
- **Background**: Deep slate (#0F172A)
- **Surface**: Medium gray (#1E293B)
- **Primary**: Cyan blue (#0EA5E9) 
- **Text**: Light gray (#F1F5F9)
- **Accents**: Dark blue/cyan tones

### Theme Persistence
- **Auto-save**: Theme preference saved automatically
- **System Sync**: Follows OS preference jika belum diset
- **Manual Override**: User selection prioritized
- **Real-time**: Instant switching tanpa refresh

## 🔄 Current Limitations (Phase 1)

### Simulated Features
- **AI Responses**: Placeholder text responses
- **File Attachments**: UI ready, no functionality
- **Voice Input**: UI ready, no functionality  
- **Character Creation**: Coming in Phase 2
- **Real API Integration**: Coming in Phase 2

### Working Features  
- ✅ **UI Navigation**: Full interface interaction
- ✅ **Theme Switching**: Complete light/dark mode
- ✅ **Message Display**: Proper chat UI
- ✅ **Settings Controls**: All sliders & toggles
- ✅ **State Persistence**: Settings & preferences saved
- ✅ **Responsive Design**: Mobile/desktop optimization

## 📱 Mobile Experience

### Responsive Breakpoints
- **Mobile**: < 768px (Overlay sidebars)
- **Tablet**: 768px - 1024px (Collapsible sidebars)  
- **Desktop**: > 1024px (Fixed sidebars)

### Mobile Navigation
- **Hamburger Menu**: Access left sidebar
- **Settings Icon**: Access right panel
- **Swipe Gestures**: Coming in Phase 2
- **Touch Optimized**: Button sizes & spacing

## 🎯 Tips & Best Practices

### Optimal Usage
1. **Start Simple**: Begin dengan "Say hello" suggestions
2. **Explore Settings**: Customize temperature untuk different responses
3. **Use Characters**: Try berbeda characters untuk variety
4. **Theme Comfort**: Switch tema sesuai lighting conditions

### Performance Tips
- **Keep Chats Organized**: Use meaningful names
- **Clear Old Chats**: Remove unused conversations  
- **Optimize Settings**: Lower max tokens untuk faster responses
- **Use Streaming**: Enable untuk better UX

### Preparation for Phase 2
- **Character Ideas**: Think tentang custom characters
- **Use Cases**: Document workflow preferences
- **Feature Requests**: Note missing functionality
- **Integration Needs**: Plan API connections

---

**Ready to explore?** Start dengan clicking "Start Chatting" dan experience ChimeraAI Phase 1! 🚀