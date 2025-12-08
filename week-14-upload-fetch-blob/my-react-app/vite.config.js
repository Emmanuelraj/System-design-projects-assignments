import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',  // Backend port
        changeOrigin: true,  // Pretends request from backend origin
        secure: false,  // For local dev
        rewrite: (path) => path  // Keeps /api prefix
      }
    }
  }
});