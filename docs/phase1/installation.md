# Installation & Setup Guide

## 📋 Prerequisites

- **Node.js**: v18+ (recommended v20+)
- **Yarn**: Latest version
- **Git**: For repository management
- **Terminal**: Bash/Zsh/PowerShell

## 🚀 Quick Installation

### 1. Navigate to ChimeraAI Directory
```bash
cd /app/ChimeraDev
```

### 2. Install Dependencies
```bash
# Install all required packages
yarn install

# Verify installation
yarn list --depth=0
```

### 3. Start Development Server
```bash
# Start frontend development server
yarn dev
```

### 4. Start Backend (SillyTavern)
```bash
# Navigate to main app directory
cd /app

# Start SillyTavern backend
node server.js --port 8000
```

### 5. Access Applications
- **ChimeraAI Frontend**: http://localhost:3001
- **SillyTavern Backend**: http://localhost:8000

## 🔧 Development Environment

### Project Structure
```
/app/ChimeraDev/
├── src/                    # Source code
│   ├── components/        # React components
│   ├── store/            # Zustand state management
│   ├── types/            # TypeScript definitions
│   ├── utils/            # Utility functions
│   └── api/              # API layer
├── public/               # Static assets
├── docs/                 # Documentation
├── package.json          # Dependencies
├── tailwind.config.js    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

### Available Scripts

```bash
# Development server with hot reload
yarn dev

# Production build
yarn build

# Preview production build
yarn preview

# Type checking
yarn tsc --noEmit

# Lint code
yarn lint
```

## ⚙️ Configuration

### Environment Variables
Create `.env` file jika diperlukan:
```bash
# Frontend environment (already configured)
VITE_API_BASE_URL=http://localhost:8000/api
```

### Vite Configuration
File `vite.config.ts` sudah dikonfigurasi untuk:
- Proxy API calls ke SillyTavern backend
- Hot module replacement
- TypeScript support
- React support

### Tailwind Configuration
File `tailwind.config.js` includes:
- Custom color palette untuk ChimeraAI
- Dark mode support
- Custom animations
- Typography settings

## 🎨 Theme System

### Color Palette
```css
/* Light Mode */
--chimera-light-primary: #3B82F6      /* Blue-500 */
--chimera-light-secondary: #93C5FD    /* Blue-300 */
--chimera-light-accent: #DBEAFE       /* Blue-100 */
--chimera-light-background: #FFFFFF   /* White */
--chimera-light-surface: #F8FAFC      /* Slate-50 */

/* Dark Mode */
--chimera-dark-primary: #0EA5E9       /* Sky-500 (cyan-blue) */
--chimera-dark-secondary: #164E63     /* Sky-900 */
--chimera-dark-accent: #0C4A6E        /* Sky-900 darker */
--chimera-dark-background: #0F172A    /* Slate-900 */
--chimera-dark-surface: #1E293B       /* Slate-800 */
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Kill process using port 3001
lsof -ti:3001 | xargs kill -9

# Or use different port
yarn dev --port 3002
```

#### 2. Module Resolution Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules yarn.lock
yarn install
```

#### 3. TypeScript Errors
```bash
# Check TypeScript configuration
yarn tsc --noEmit

# Restart TypeScript service in VS Code
Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"
```

#### 4. Tailwind CSS Not Loading
```bash
# Ensure PostCSS is properly configured
cat postcss.config.js

# Verify Tailwind is imported in index.css
head -5 src/index.css
```

### Development Tools

#### Browser Extensions
- **React Developer Tools**: Debugging React components
- **Redux DevTools**: State management debugging (Zustand support)

#### VS Code Extensions
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Importer
- Auto Rename Tag
- Prettier - Code formatter

## 📦 Dependencies Overview

### Core Dependencies
```json
{
  "react": "^19.2.0",           // React library
  "react-dom": "^19.2.0",      // React DOM renderer
  "typescript": "^5.9.3",      // TypeScript
  "zustand": "^5.0.8",         // State management
  "axios": "^1.12.2",          // HTTP client
  "lucide-react": "^0.544.0"   // Icons
}
```

### Development Dependencies
```json
{
  "vite": "^7.1.9",            // Build tool
  "tailwindcss": "^3.4.18",    // CSS framework
  "autoprefixer": "^10.4.21",  // CSS post-processor
  "@vitejs/plugin-react": "^5.0.4"  // Vite React plugin
}
```

## 🚀 Production Deployment

### Build for Production
```bash
# Create optimized build
yarn build

# Test production build locally
yarn preview
```

### Build Output
```
dist/
├── assets/          # Bundled CSS & JS
├── index.html      # Entry HTML file
└── vite.svg        # Default Vite icon
```

## 📊 Performance Optimization

### Development Mode
- Hot Module Replacement (HMR) enabled
- Source maps for debugging
- Fast refresh for React components

### Production Mode
- Code splitting
- Tree shaking
- Minification
- Gzip compression

---

**Need Help?** Check [Technical Specifications](./technical-specs.md) untuk detail lebih lanjut.