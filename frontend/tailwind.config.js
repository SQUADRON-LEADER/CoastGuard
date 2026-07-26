/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary — Deep Ocean Intelligence palette
        ocean: {
          50: '#E8F0FE',
          100: '#C5D9FC',
          200: '#8FB3F9',
          300: '#5A8DF5',
          400: '#3371E8',
          500: '#1E90FF', // Sea Blue
          600: '#1565C0',
          700: '#0D47A1',
          800: '#0A2540', // Deep Ocean Blue
          900: '#061829',
        },
        teal: {
          50: '#E6FAFB',
          100: '#B3F0F2',
          200: '#80E6EA',
          300: '#4DDCE1',
          400: '#26D2D9',
          500: '#0891B2',
          600: '#067A97',
          700: '#05627A',
          800: '#034A5C',
          900: '#02323E',
        },
        coral: {
          50: '#FFF0F0',
          100: '#FFD6D7',
          200: '#FFADAF',
          300: '#FF8487',
          400: '#FF6F72',
          500: '#FF5A5F', // Emergency Coral
          600: '#E0484D',
          700: '#C2363B',
          800: '#A32429',
          900: '#851217',
        },
        sand: {
          50: '#F5F7FA', // Sand Beige
          100: '#EBEEF3',
          200: '#D7DCE5',
          300: '#C3CAD7',
          400: '#A8B2C3',
          500: '#8D9AB0',
          600: '#72829C',
          700: '#5A6A84',
          800: '#42526B',
          900: '#2C3A53',
        },
        // Keep backward compat
        sandy: {
          50: '#FEF3C7',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(10, 37, 64, 0.08)',
        'glass-lg': '0 12px 48px rgba(10, 37, 64, 0.12)',
        'glass-xl': '0 20px 60px rgba(10, 37, 64, 0.16)',
        'card': '0 1px 3px rgba(10, 37, 64, 0.06), 0 4px 12px rgba(10, 37, 64, 0.04)',
        'card-hover': '0 4px 12px rgba(10, 37, 64, 0.08), 0 12px 32px rgba(10, 37, 64, 0.08)',
        'nav': '0 1px 2px rgba(10, 37, 64, 0.04), 0 4px 16px rgba(10, 37, 64, 0.06)',
        'urgent': '0 0 0 2px rgba(255, 90, 95, 0.2), 0 4px 16px rgba(255, 90, 95, 0.15)',
      },
      backgroundImage: {
        'ocean-gradient': 'linear-gradient(135deg, #0A2540 0%, #1565C0 50%, #0891B2 100%)',
        'ocean-light': 'linear-gradient(135deg, #F5F7FA 0%, #E8F0FE 50%, #E6FAFB 100%)',
        'ocean-subtle': 'linear-gradient(180deg, #F5F7FA 0%, #FFFFFF 100%)',
        'glass-white': 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
        'hero-pattern': 'radial-gradient(ellipse at 20% 50%, rgba(30,144,255,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(8,145,178,0.06) 0%, transparent 50%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'wave': 'wave 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wave: {
          '0%, 100%': { transform: 'translateX(0px)' },
          '50%': { transform: 'translateX(10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};