/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './packages/app/src/**/*.{ts,tsx}',
    './apps/**/src/**/*.{ts,tsx}',
    './showcase/**/src/**/*.{ts,tsx}',
    './packages/headless/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
