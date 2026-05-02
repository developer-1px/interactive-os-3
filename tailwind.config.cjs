/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    relative: true,
    files: [
      './index.html',
      './packages/app/src/**/*.{ts,tsx}',
      './packages/headless/src/**/*.{ts,tsx}',
      './apps/*/src/**/*.{ts,tsx}',
      './showcase/*/src/**/*.{ts,tsx}',
    ],
  },
  theme: {
    extend: {},
  },
  plugins: [],
}
