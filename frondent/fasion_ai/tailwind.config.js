/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#05070e",
        "glass-dark": "rgba(15, 23, 42, 0.6)",
      },
      boxShadow: {
        glass:
          "0 8px 32px rgba(2, 6, 23, 0.45), inset 0 1px 0 rgba(255,255,255,0.12)",
      },
    },
  },
  plugins: [],
}
