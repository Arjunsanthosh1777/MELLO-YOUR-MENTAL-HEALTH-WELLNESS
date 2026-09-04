
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mello: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
          softBg: '#FAF5FF',
          card: '#FFFFFF',
          mint: {
            light: '#ECFDF5',
            DEFAULT: '#10B981',
            dark: '#059669',
          },
          amber: {
            light: '#FFFBEB',
            DEFAULT: '#F59E0B',
            dark: '#D97706',
          },
          sky: {
            light: '#F0F9FF',
            DEFAULT: '#0284C7',
            dark: '#0369A1',
          },
          rose: {
            light: '#FFF1F2',
            DEFAULT: '#F43F5E',
            dark: '#E11D48',
          }
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        heading: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'mello-sm': '0 4px 20px -2px rgba(139, 92, 246, 0.08)',
        'mello': '0 10px 30px -4px rgba(139, 92, 246, 0.12)',
        'mello-lg': '0 20px 40px -6px rgba(139, 92, 246, 0.18)',
        'mello-glow': '0 0 25px rgba(167, 139, 250, 0.4)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s infinite',
        'breathe': 'breathe 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.75' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.4)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
