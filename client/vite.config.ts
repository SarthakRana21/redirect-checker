import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
   preview: {
    port: 4173,
    allowedHosts: ['redirect-checker.newsoftdemo.info']
  }
})
