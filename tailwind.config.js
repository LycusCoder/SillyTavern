/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode colors
        'chimera-light': {
          primary: '#3B82F6',    // Blue-500
          secondary: '#93C5FD',  // Blue-300  
          accent: '#DBEAFE',     // Blue-100
          background: '#FFFFFF', // White
          surface: '#F8FAFC',    // Slate-50
          text: '#1E293B',       // Slate-800
          muted: '#64748B'       // Slate-500
        },
        // Dark mode colors
        'chimera-dark': {
          primary: '#0EA5E9',    // Sky-500 (cyan-blue)
          secondary: '#164E63',  // Sky-900
          accent: '#0C4A6E',     // Sky-900 darker
          background: '#0F172A', // Slate-900
          surface: '#1E293B',    // Slate-800
          text: '#F1F5F9',       // Slate-100
          muted: '#94A3B8'       // Slate-400
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace']
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' }
        }
      }
    },
  },
  plugins: [],
}