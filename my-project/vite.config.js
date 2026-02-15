import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/github_pages/',
  plugins: [
    tailwindcss(),
  ],
})