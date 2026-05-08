import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',  // ← இது already default, but explicit-ஆ போடு
  build: {
    outDir: 'dist',
    copyPublicDir: true,  // ← இந்த line add பண்ணு
  }
})