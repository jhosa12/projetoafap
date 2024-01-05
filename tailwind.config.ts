import type { Config } from 'tailwindcss'
// tailwind.config.js

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  
    darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {"50":"#fdf4ff","100":"#fae8ff","200":"#f5d0fe","300":"#f0abfc","400":"#e879f9","500":"#d946ef","600":"#c026d3","700":"#a21caf","800":"#86198f","900":"#701a75","950":"#4a044e"}
      }
    },
    fontFamily: {
      'roboto': ['Roboto', 'sans-serif'],
      'body': [
    'Segoe UI Emoji', 
    'Apple Color Emoji', 
    'Roboto', 
    'ui-sans-serif', 
    'system-ui', 
    '-apple-system', 
    'system-ui', 
    'Segoe UI',  
    'Helvetica Neue', 
    'Arial', 
    'Noto Sans', 
    'sans-serif', 
    
    'Segoe UI Symbol', 
    'Noto Color Emoji'
  ],
      'sans': [
    'Segoe UI Emoji', 
    'Apple Color Emoji',
    'Roboto', 
    'ui-sans-serif', 
    'system-ui', 
    '-apple-system', 
    'system-ui', 
    'Segoe UI', 
    'Helvetica Neue', 
    'Arial', 
    'Noto Sans', 
    'sans-serif',  
    'Segoe UI Symbol', 
    'Noto Color Emoji'
  ]
    }
  }
  },
  plugins: [],
}
export default config
