/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coral: {
          DEFAULT: '#FF7F50',
          '50': '#FFECE5',
          '100': '#FFD9CC',
          '200': '#FFB399',
          '300': '#FF8C66',
          '400': '#FF6633',
          '500': '#FF7F50',
          '600': '#E67346',
          '700': '#CC6640',
          '800': '#B3593A',
          '900': '#994D33',
        },
      },
    },
  },
  variants: {
    extend: {
      // Add variants as needed
    },
  },
  plugins: [],
}

