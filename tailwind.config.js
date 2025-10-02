/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f3f1f7',
          100: '#e6e2ef',
          200: '#ccc5df',
          300: '#b3a8cf',
          400: '#998bbf',
          500: '#806eaf',
          600: '#5F4191',
          700: '#4d3374',
          800: '#3a2557',
          900: '#27173a',
          DEFAULT: '#5F4191',
        },
      },
    },
  },
  plugins: [],
}
