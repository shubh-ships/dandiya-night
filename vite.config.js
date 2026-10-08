import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Everything (JS, CSS, images) is inlined into index.html so each visit costs one CDN request —
// keeps the site well inside Vercel's free 1M-requests/month limit.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: {
    assetsInlineLimit: 100_000,
  },
})
