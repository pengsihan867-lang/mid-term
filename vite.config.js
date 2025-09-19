import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/p2p-trading-visualizer/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
