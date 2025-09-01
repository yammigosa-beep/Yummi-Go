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
      },
    }
  },
  plugins: []
}
