/**
 * tailwind.config.js
 * Author: Yewbdar Abera
 * Date: May 4, 2026
 *
 * Tailwind is scoped only to our source files so it doesn't
 * bloat the build with unused utility classes.
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // Let MUI handle its own colors — we just need Tailwind for spacing/layout utilities
  important: "#root",
  theme: {
    extend: {},
  },
  plugins: [],
};
