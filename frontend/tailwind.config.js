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
      },
      animation: {
        slideIn: 'slideIn 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
