/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          bg: '#090D16',
          card: 'rgba(17, 24, 39, 0.75)',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        neon: {
          violet: '#8B5CF6',
          indigo: '#4F46E5',
          cyan: '#06B6D4',
          emerald: '#10B981',
          gold: '#F59E0B',
          coral: '#EF4444',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-slow': 'glow 4s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { transform: 'scale(1) translate(0px, 0px)', filter: 'blur(40px)', opacity: 0.3 },
          '100%': { transform: 'scale(1.1) translate(10px, -10px)', filter: 'blur(60px)', opacity: 0.5 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}

