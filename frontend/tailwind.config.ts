import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode
        'bg-primary': '#FFFFFF',
        'bg-secondary': '#F5F5F5',
        'bg-tertiary': '#FAFAFA',
        'text-primary': '#1A1A1A',
        'text-secondary': '#666666',
        'text-tertiary': '#999999',
        'border': '#E0E0E0',
        'border-hover': '#CCCCCC',
        // Dark mode
        'bg-primary-dark': '#0A0A0A',
        'bg-secondary-dark': '#1A1A1A',
        'bg-tertiary-dark': '#242424',
        'text-primary-dark': '#FFFFFF',
        'text-secondary-dark': '#B0B0B0',
        'text-tertiary-dark': '#808080',
        'border-dark': '#2A2A2A',
        'border-hover-dark': '#404040',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['Monaco', 'Courier New', 'monospace'],
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
