/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        corporate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          navy: '#0b192c',
          blue: '#1d4ed8',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'Noto Sans Telugu', 'sans-serif'],
        telugu: ['Noto Sans Telugu', 'Outfit', 'sans-serif'],
      },
      boxShadow: {
        'corporate': '0 4px 20px -2px rgba(15, 23, 42, 0.08)',
        'corporate-hover': '0 20px 30px -10px rgba(15, 23, 42, 0.12)',
        'glow-blue': '0 0 25px -5px rgba(29, 78, 216, 0.25)',
      }
    },
  },
  plugins: [],
};
