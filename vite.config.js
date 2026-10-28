import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'
import { productionPublicAssets } from './scripts/production-assets.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  server: { host: 'localhost', port: 5173, strictPort: true },
  plugins: [react(), tailwindcss(), productionPublicAssets()],
  build: { copyPublicDir: false },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
