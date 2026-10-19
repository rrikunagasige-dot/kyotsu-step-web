import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // The checked-out Git SHA wins over any stale project-level preview label.
  // GitHub Actions uses its exact PR head; a deployment lacking a reliable SHA fails closed.
  define: {
    'import.meta.env.VITE_PREVIEW_COMMIT': JSON.stringify(
      process.env.VERCEL_GIT_COMMIT_SHA || (process.env.GITHUB_ACTIONS ? process.env.VITE_PREVIEW_COMMIT : '') || '',
    ),
  },
  // GitHub Pages production keeps its existing base; isolated PR previews can serve at /.
  base: process.env.VITE_BASE_PATH || '/kyotsu-step-web/',
  server: { port: 4173, strictPort: true },
  preview: { port: 4173, strictPort: true },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/katex') || id.includes('node_modules/react-katex')) return 'math-renderer'
          if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) return 'react-core'
          if (id.includes('node_modules/zod')) return 'schema'
          if (id.includes('node_modules/zustand')) return 'state'
          if (id.includes('node_modules/lucide-react')) return 'icons'
        },
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: { reporter: ['text', 'html'] },
  },
})