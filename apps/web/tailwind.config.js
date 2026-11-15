/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './layouts/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#070b19',
          'bg-secondary': '#0a1128',
          card: '#0d1730',
          'card-hover': '#111f42',
          border: '#172554',
          'border-bright': '#1e3a8a',
          primary: '#0066ff',
          cyan: '#00d2ff',
          neon: '#00f2fe',
          accent: '#4facfe',
          danger: '#ef4444',
          warning: '#f59e0b',
          success: '#10b981',
          muted: '#8ba2c4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'cyber-glow': '0 0 25px -5px rgba(0, 102, 255, 0.4)',
        'cyan-glow': '0 0 25px -5px rgba(0, 210, 255, 0.4)',
        'card-glow': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 15px -3px rgba(0, 102, 255, 0.15)',
      },
    },
  },
  plugins: [],
};
