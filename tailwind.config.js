module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        'cairo': ['Cairo', 'sans-serif'],
      },
      colors: {
        'yummi': {
          'primary': '#F57C00',
          'secondary': '#43A047',
          'accent': '#fd9900',
          'hover': '#FFC107',
        },
        'text': {
          'heading': '#101113',
          'body': '#53565c',
          'dark': '#333333',
        },
        'bg': {
          'off-white': '#f8f8f8',
          'warm-dark': '#391512',
          'light-gray': '#EEF0EF',
        }
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out forwards',
        'fade-in-delayed': 'fadeInDelayed 1.2s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spinSlow 8s linear infinite',
        'slow-rotate': 'slowRotate 12s ease-in-out infinite',
        'pulse-slow': 'pulseSlow 4s ease-in-out infinite',
        'about-float': 'aboutFloat 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeInDelayed: {
          '0%': {
            opacity: '0',
            transform: 'translateX(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        spinSlow: {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
        slowRotate: {
          '0%': { transform: 'rotate(-6deg) scale(1)' },
          '50%': { transform: 'rotate(6deg) scale(1.01)' },
          '100%': { transform: 'rotate(-6deg) scale(1)' },
        },
        pulseSlow: {
          '0%, 100%': {
            opacity: '0.15',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '0.25',
            transform: 'scale(1.05)',
          },
        },
        aboutFloat: {
          '0%': { transform: 'translateY(0) rotate(-2deg)' },
          '50%': { transform: 'translateY(-14px) rotate(2deg)' },
          '100%': { transform: 'translateY(0) rotate(-2deg)' },
        },
      },
      utilities: {
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.border-3': {
          'border-width': '3px',
        },
      },
    }
  },
  plugins: []
}
