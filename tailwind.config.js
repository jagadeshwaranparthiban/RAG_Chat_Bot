module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**.{tsx}'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}
