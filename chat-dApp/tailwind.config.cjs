module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}', './*.html'],
  theme: {
    extend: {},
  },
  plugins: [],
  purge: [
    "./src/**/*.{ts,tsx,svelte}"
  ],
}
