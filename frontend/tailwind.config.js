/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        surface: {
          bg: '#02060f',
          card: '#0c121f',
          elevated: '#070e18',
        },
        brand: {
          purple: '#583ecb',
          border: '#2A3148',
        },
        money: {
          green: '#10c67a',
          red: '#f94770',
          blue: '#3897db',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
