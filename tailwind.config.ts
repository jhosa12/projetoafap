// tailwind.config.js
import type { Config } from 'tailwindcss'
import flowbite from "flowbite-react/tailwind";
const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite-react/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
    // Se você estiver usando NextUI e precisa incluir os componentes do NextUI,
    // você pode adicionar o caminho apropriado aqui, mas verifique a documentação do NextUI para os caminhos corretos.
    // "./node_modules/@nextui-org/theme/dist/components/*.js"
  ],
  theme: {
    //darkMode: 'class',
    extend: {
      colors: {
        primary: {
          "50": "#fdf4ff",
          "100": "#fae8ff",
          "200": "#f5d0fe",
          "300": "#f0abfc",
          "400": "#e879f9",
          "500": "#d946ef",
          "600": "#c026d3",
          "700": "#a21caf",
          "800": "#86198f",
          "900": "#701a75",
          "950": "#4a044e"
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
         'ui-sans-serif', 'Inter',  'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'
        ]
      }
    }
  },
  plugins: [
  //  require('flowbite/plugin'),
    flowbite.plugin(),
  
  ],
}

export default config
