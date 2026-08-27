/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/features/**/*.{js,jsx}",
    "./src/pages/**/*.{js,jsx}",
    "./src/layout/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        slideIn: 'slideIn 0.3s ease-out',
        'fade-in': 'fade-in 0.25s ease-out both',
        'slide-up': 'slide-up 0.3s ease-out both',
        shimmer: 'shimmer 1.5s linear infinite',
      },
    },
  },
  plugins: [],
}
