/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: '#07070A',
        obsidian: '#0D0D12',
        surface: '#131319',
        elevated: '#1A1A22',
        trim: '#23232E',
        champagne: '#C8A45A',
        'gold-light': '#EED880',
        offwhite: '#F0EBE1',
        cream: '#FAF7F0',
        muted: '#706A78',
        coral: '#CF6080',
      },
      fontFamily: {
        heading: ['Cormorant Garamond', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
