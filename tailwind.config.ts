import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // MLV Brand Colors
        brand: {
          green: '#6AC670',
          yellow: '#F2CF07',
          black: '#060606',
          gray: '#484848',
          'light-gray': '#F3F3F1',
          white: '#FCFCFC',
        },
        // Primary (60% usage)
        primary: {
          DEFAULT: '#6AC670',
          light: '#8BD490',
          dark: '#4FA855',
        },
        // Secondary accent
        secondary: {
          DEFAULT: '#F2CF07',
          light: '#F5DA3A',
          dark: '#D4B506',
        },
        // Dark backgrounds
        dark: {
          DEFAULT: '#1a1a2e',
          lighter: '#252542',
          card: '#2a2a4a',
          pure: '#060606',
        },
        // Light backgrounds
        light: {
          DEFAULT: '#FCFCFC',
          gray: '#F3F3F1',
        },
        // Accent colors (10% usage)
        accent: {
          coral: '#FF6B6B',
          teal: '#4ECDC4',
          purple: '#C77DFF',
        },
        // Text colors
        text: {
          primary: '#060606',
          secondary: '#484848',
          light: '#F3F3F1',
          muted: '#6B7280',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #1a1a2e 0%, #252542 50%, #1a1a2e 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(106, 198, 112, 0.1) 0%, rgba(242, 207, 7, 0.1) 100%)',
        'cta-gradient': 'linear-gradient(135deg, #6AC670 0%, #F2CF07 100%)',
        'border-gradient': 'linear-gradient(135deg, #6AC670, #F2CF07)',
        'glow-gradient': 'linear-gradient(90deg, #6AC670, #F2CF07, #6AC670)',
        'text-gradient': 'linear-gradient(135deg, #6AC670 0%, #F2CF07 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-slower': 'float 10s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'gradient-x': 'gradient-x 3s ease infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-slow': 'bounce 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'scroll': 'scroll 1.5s ease-in-out infinite',
        'slide-in': 'slideIn 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(106, 198, 112, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(106, 198, 112, 0.8)' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        scroll: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(8px)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 40px rgba(106, 198, 112, 0.3)',
        'glow-lg': '0 0 60px rgba(106, 198, 112, 0.4)',
        'glow-green': '0 0 30px rgba(106, 198, 112, 0.4)',
        'glow-yellow': '0 0 30px rgba(242, 207, 7, 0.3)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 16px 48px rgba(0, 0, 0, 0.4)',
        'card-green': '0 8px 32px rgba(106, 198, 112, 0.2)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
}
export default config
