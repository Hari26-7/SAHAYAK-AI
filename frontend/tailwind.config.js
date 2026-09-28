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
          navy: '#002855',
          darkNavy: '#001a38',
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
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        gov: '0 2px 8px -1px rgba(0, 40, 85, 0.08), 0 1px 3px -1px rgba(0, 40, 85, 0.04)',
        'gov-lg': '0 10px 25px -3px rgba(0, 40, 85, 0.1), 0 4px 6px -2px rgba(0, 40, 85, 0.05)',
      }
    },
  },
  plugins: [],
}
