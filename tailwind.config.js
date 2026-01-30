/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'ui-serif', 'Georgia', 'serif']
      },
      colors: {
        cream: { DEFAULT: '#fefdfb', dark: '#faf8f5' },
        accent: { DEFAULT: '#7c6a5d', light: '#9d8b7c', dark: '#5a4d42' }
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' }
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        slideInRight: {
          '0%': { transform: 'translateX(30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        fadeUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(124, 106, 93, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(124, 106, 93, 0.6)' }
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        },
        breath: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.98' },
          '50%': { transform: 'scale(1.02)', opacity: '1' }
        }
      },
      animation: {
        shimmer: 'shimmer 6s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'slide-in-left': 'slideInLeft 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.6s ease-out',
        'fade-up': 'fadeUp 0.8s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
        'breath': 'breath 4s ease-in-out infinite'
      }
    }
  },
  plugins: []
}
