/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages: проект доступен по /<repo>/; в CI переменная GITHUB_REPOSITORY задана автоматически
function resolveBase(): string {
  const explicit = process.env.VITE_BASE?.trim()
  if (explicit) return explicit.endsWith('/') ? explicit : `${explicit}/`
  const repo = process.env.GITHUB_REPOSITORY?.split('/')[1]
  if (repo) return `/${repo}/`
  return '/'
}

export default defineConfig({
  base: resolveBase(),
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.stories.{ts,tsx}', 'src/test/**', 'src/main.tsx'],
    },
  },
})
