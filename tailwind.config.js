/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  media: false,
  content: [
    './public/**/*.html',
    "./src/**/*.{ts,html,scss}"
  ],
  // content: [
  //   "./src/**/*.{html,ts}",
  // ],
  theme: {
    // fontFamily: {
    //   sans: ['Roboto-Mono', 'Helvetica Neue', 'sans-serif'],
    //   serif: ['Roboto', 'serif'],
    // },
    extend: {
      colors: {
        green: require('tailwindcss/colors').emerald,
        yellow: require('tailwindcss/colors').amber,
        purple: require('tailwindcss/colors').violet,
      }
    }
  },
  plugins: [],
}
