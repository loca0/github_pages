import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

const repoBase = process.env.NODE_ENV === 'production' ? '/github_pages/' : '/'

export default defineConfig({
  base: repoBase,
  plugins: [
    tailwindcss(),
  ],
})