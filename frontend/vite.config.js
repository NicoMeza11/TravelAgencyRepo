import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    hmr: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    // Aumentar el límite de headers
    maxHeaderSize: 32768, // 32kb
  },
})
