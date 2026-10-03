/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0B3B60',
          darkNavy: '#082b47',
          blue: '#004080',
          lightBlue: '#eef5fc',
          saffron: '#FF9933',
          saffronDark: '#D97706',
          green: '#138808',
          greenDark: '#0E6806',
          ashoka: '#000080',
          border: '#D1D5DB',
          bgLight: '#F8FAFC',
          cardLight: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Inter', '"Noto Sans Devanagari"', '"Noto Sans Tamil"', 'Roboto', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        gov: '0 2px 8px -1px rgba(11, 59, 96, 0.08), 0 1px 3px -1px rgba(11, 59, 96, 0.04)',
        'gov-lg': '0 10px 25px -3px rgba(11, 59, 96, 0.1), 0 4px 6px -2px rgba(11, 59, 96, 0.05)',
        'card-soft': '0 2px 10px -3px rgba(6, 81, 237, 0.1)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.04)',
        'glow-indigo': '0 4px 20px -2px rgba(99, 102, 241, 0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 2.5s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(1rem)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.03)', opacity: '0.9' },
        },
      },
    },
  },
  plugins: [],
}
