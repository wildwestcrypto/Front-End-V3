/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // The Evergreen Exchange Brand Colors
        evergreen: {
          50: '#f3f6f4',
          100: '#e3ebe5',
          200: '#c7d7cb',
          300: '#a1baaa',
          400: '#789886',
          500: '#5a7c69',
          600: '#476353',
          700: '#2F5233', // Deep Forest Green (Primary)
          800: '#2a4229',
          900: '#243724',
          950: '#111c13',
        },
        olive: {
          50: '#f7f9f3',
          100: '#edf2e4',
          200: '#dbe6ca',
          300: '#c2d5a7',
          400: '#AFC17F', // Siskin Sprout (Primary)
          500: '#92a965',
          600: '#76894d',
          700: '#5c6b3e',
          800: '#4b5635',
          900: '#3f492e',
          950: '#212815',
        },
        money: {
          50: '#f2f9ed',
          100: '#e2f2d7',
          200: '#c6e6b3',
          300: '#9dd484',
          400: '#85BB65', // Money Green (Primary)
          500: '#5e9f43',
          600: '#488032',
          700: '#39632a',
          800: '#304f25',
          900: '#294321',
          950: '#13240e',
        },
        gold: {
          50: '#faf8f0',
          100: '#f4eed9',
          200: '#e8dab3',
          300: '#dac284',
          400: '#C8A44D', // Balanced Neutral Metallic Gold (Primary)
          500: '#bd9241',
          600: '#a57636',
          700: '#88592e',
          800: '#70492b',
          900: '#5e3e27',
          950: '#362013',
        },
        cream: {
          50: '#fdfcf8',
          100: '#faf8f0',
          200: '#F5F2E2', // Soft Cream (Primary)
          300: '#ebe7d3',
          400: '#ddd6bc',
          500: '#cec19d',
          600: '#bda984',
          700: '#a0906f',
          800: '#84755d',
          900: '#6d604e',
          950: '#3a3128',
        },
      },
      fontFamily: {
        sans: [
          'Plus Jakarta Sans',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
      },
      boxShadow: {
        'evergreen-sm': '0 2px 8px rgba(47, 82, 51, 0.08)',
        'evergreen': '0 4px 16px rgba(47, 82, 51, 0.1)',
        'evergreen-lg': '0 8px 24px rgba(47, 82, 51, 0.15)',
        'evergreen-xl': '0 16px 48px rgba(47, 82, 51, 0.2)',
      },
      backgroundImage: {
        'evergreen-gradient': 'linear-gradient(135deg, #2F5233 0%, #AFC17F 100%)',
        'olive-gradient': 'linear-gradient(135deg, #AFC17F 0%, #85BB65 100%)',
        'gold-gradient': 'linear-gradient(135deg, #C8A44D 0%, #bd9241 100%)',
      },
    },
  },
  plugins: [],
}
