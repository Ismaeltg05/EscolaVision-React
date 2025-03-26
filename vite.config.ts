import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  base: '/EscolaVision-React/',
  server: {
    proxy: {
      '/crud': 'http://servidor.ieshlanz.es:8000',
    },
  },
})
