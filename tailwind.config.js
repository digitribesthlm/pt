/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["dark"]
  }
}
