import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors:{
        "btn-red":"#ff5631",
        "jiak-Red":"#ff5631",
        "jiak-peach": "#fff0E3"
      }
    },
  },
  plugins: [],
} satisfies Config;
