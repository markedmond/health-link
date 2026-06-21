/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.html', './public/js/**/*.js', './server/**/*.js'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5fdfb',
          100: '#e6f9f7',
          500: '#0d6e6e'
        }
      },
      spacing: {
        '128': '32rem'
      }
    }
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light', 'dark']
  }
};
