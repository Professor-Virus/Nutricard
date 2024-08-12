/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'charcoal-black': '#333333', // Adjust this color as needed
        'blue': {
          600: '#1D4ED8',
          700: '#1E40AF',
        },
        'purple': {
          600: '#6D28D9',
          700: '#4C1D95',
        },
      },
    },
  },
  plugins: [],
};
