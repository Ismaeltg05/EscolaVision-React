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
      '/leer': 'https://cors-proxy.escolavisionhlanz.workers.dev/',
      '/login': 'https://cors-proxy.escolavisionhlanz.workers.dev/',
      '/insertar': 'https://cors-proxy.escolavisionhlanz.workers.dev/',
      '/actualizar': 'https://cors-proxy.escolavisionhlanz.workers.dev/',
    },
  },
})
