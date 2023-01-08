/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      gridTemplateColumns: {
        boards: "repeat(auto-fit, minmax(18rem, 24rem))",
      },
    },
  },
  plugins: [],
};
