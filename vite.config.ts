import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages: https://<user>.github.io/web-giants/
export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/web-giants/' : '/',
  plugins: [react(), tailwindcss()],
})
