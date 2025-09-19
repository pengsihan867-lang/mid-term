import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/mid-term/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})