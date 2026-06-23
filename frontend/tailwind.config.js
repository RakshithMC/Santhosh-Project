/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // support class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4F46E5",
          dark: "#4338CA",
          light: "#818CF8",
        },
        secondary: {
          DEFAULT: "#8B5CF6",
          dark: "#7C3AED",
          light: "#A78BFA",
        },
        accent: {
          DEFAULT: "#22C55E",
          dark: "#16A34A",
          light: "#4ADE80",
        },
        darkbg: {
          DEFAULT: "#0F172A",
          card: "#1E293B",
          border: "#334155",
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-hover': '0 8px 32px 0 rgba(79, 70, 229, 0.45)',
      }
    },
  },
  plugins: [],
}
