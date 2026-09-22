/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFDF9',
          100: '#FAF6EE',
          200: '#F3ECE0',
          300: '#E8DEC9',
        },
        lavender: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
        },
        coral: {
          50: '#FFF1F0',
          100: '#FFE4E1',
          200: '#FFCCC7',
          300: '#FFA39E',
          400: '#FF7875',
          500: '#FF5A5F',
          600: '#E03E44',
          700: '#B8282D',
        },
        peach: {
          50: '#FFF6EF',
          100: '#FFEBDC',
          200: '#FFD6BA',
          300: '#FFBA88',
          400: '#FB923C',
          500: '#EA580C',
        },
        navy: {
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#0B1120',
        },
        mint: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.02)',
        'card': '0 4px 20px -2px rgba(124, 58, 237, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.03)',
        'card-hover': '0 12px 30px -4px rgba(124, 58, 237, 0.12), 0 4px 12px -2px rgba(255, 90, 95, 0.06)',
        'glass': '0 8px 32px 0 rgba(124, 58, 237, 0.08)',
      }
    },
  },
  plugins: [],
}
