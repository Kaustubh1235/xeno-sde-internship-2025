import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // This will proxy any request starting with /api to our backend server
      '/api': {
        target: 'http://localhost:8000', // Your backend server address
        changeOrigin: true,
      },
    },
  },
});