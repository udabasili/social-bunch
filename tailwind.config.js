const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  mode: 'jit',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
          fontFamily: {
            sans: ['Poppins', ...defaultTheme.fontFamily.sans],
            display: ['Oswald', ...defaultTheme.fontFamily.sans]
          }
        }
    },
  plugins: [
    require('@tailwindcss/typography')
  ],
}

