// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Your custom colors
        "clay-red": "#C1440E",
        "leafy-green": "#2E8B57",
        "warm-yellow": "#F4C542",
        ivory: "#FAF9F6",
        "dark-brown": "#2C2C2C",
      },
      fontFamily: {
        sans: ['"Open Sans"', "sans-serif"],
        serif: ['"Playfair Display"', "serif"],
        heading: ['"Abril Fatface"', "cursive"],
      },
      animation: {
        marquee: "marquee 20s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
