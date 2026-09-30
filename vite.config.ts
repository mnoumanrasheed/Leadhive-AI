import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The backend URL is provided to the browser via VITE_YOUTUBE_API_BASE_URL.
// No proxy is needed: the React app calls the backend directly using that URL.
// For local development, ensure VITE_YOUTUBE_API_BASE_URL is set in .env.local.
export default defineConfig({
  plugins: [react()],
})
