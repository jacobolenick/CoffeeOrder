/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/renderer/src/**/*.{js,ts,jsx,tsx}', './src/renderer/index.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'Helvetica Neue', 'sans-serif'],
      },
      colors: {
        surface: {
          light: '#ffffff',
          dark: '#1c1c1e',
        },
        bg: {
          light: '#f2f2f7',
          dark: '#000000',
        },
        card: {
          light: '#ffffff',
          dark: '#2c2c2e',
        },
        border: {
          light: '#e5e5ea',
          dark: '#3a3a3c',
        },
        text: {
          primary: {
            light: '#000000',
            dark: '#ffffff',
          },
          secondary: {
            light: '#6e6e73',
            dark: '#98989d',
          },
        },
        accent: {
          DEFAULT: '#007aff',
          hover: '#0066d6',
        },
        callout: {
          bg: {
            light: '#fff9db',
            dark: '#332d00',
          },
          border: {
            light: '#f5c518',
            dark: '#b8940d',
          },
        },
        quote: {
          border: '#007aff',
        },
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.zinc[800]'),
            '--tw-prose-headings': theme('colors.zinc[900]'),
            '--tw-prose-invert-body': theme('colors.zinc[200]'),
            '--tw-prose-invert-headings': theme('colors.white'),
            maxWidth: 'none',
          },
        },
      }),
    },
  },
  plugins: [],
}
