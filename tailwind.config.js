/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'sm': '351px',
      'md':'576px',
      'tablet':'768px',
      'lg': '905px',
      'xl':'1017px',
      '2xl':'1190px'
    },
    extend: {
      keyframes:{
        rotate180:{
          '0%' : {
            transform: 'rotate(0deg)',
          },
          '100%' : {
            transform: 'rotate(360deg)',
          }
        },
        }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp')
  ],
}