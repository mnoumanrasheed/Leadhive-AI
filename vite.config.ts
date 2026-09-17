import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(() => {
  const youtubeProxy = {
    '/api/youtube': {
      target: 'http://127.0.0.1:8000',
      changeOrigin: true,
      // bot.py keeps OAuth at /auth/youtube, while session remains under /api/youtube.
      // Map only those two OAuth endpoints; do not remove the API prefix generally.
      rewrite: (path: string) => {
        if (path === '/api/youtube/auth/login') return '/auth/youtube/login'
        if (path.startsWith('/api/youtube/auth/callback')) {
          return path.replace('/api/youtube/auth/callback', '/auth/youtube/callback')
        }
        return path
      },
    },
  }
  return {
    plugins: [react()],
    server: { proxy: youtubeProxy },
    preview: { proxy: youtubeProxy },
  }
})