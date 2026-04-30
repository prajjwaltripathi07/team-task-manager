/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6', // Primary teal
          600: '#0d9488',
          900: '#134e4a',
        },
        dark: {
          900: '#0f172a', // Main bg
          800: '#1e293b', // Card bg
          700: '#334155', // Border
          600: '#475569', // Hover state for scrollbar
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
