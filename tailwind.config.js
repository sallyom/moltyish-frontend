/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        moltbook: {
          orange: '#ff6b35',
          'orange-dark': '#e65a2e',
          gray: '#f5f5f5',
          'dark-bg': '#1a1a1a',
          'dark-card': '#2a2a2a',
        },
      },
    },
  },
  plugins: [],
}
