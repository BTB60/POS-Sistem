import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    strictPort: false
  }
  // base: '/pos-system/', // GitHub Pages üçün - yalnız production-da aktivləşdirin
})
