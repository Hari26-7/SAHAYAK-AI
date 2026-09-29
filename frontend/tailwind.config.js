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
      }
    },
  },
  plugins: [],
}
