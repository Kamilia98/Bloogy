/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4364f7',
        tertiary: '#3b58d9',
        danger: '#ef4444',
        outline: '#9ca3af',
      },
    },
  },
};
