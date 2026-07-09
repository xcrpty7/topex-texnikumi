import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': { target: 'http://localhost:10000', changeOrigin: true },
      '/uploads': { target: 'http://localhost:10000', changeOrigin: true },
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'state-vendor': ['@reduxjs/toolkit', 'react-redux'],
          'ui-vendor': ['framer-motion', 'swiper', 'lucide-react'],
          'i18n-vendor': ['i18next', 'react-i18next'],
          'firebase-vendor': ['firebase/app', 'firebase/storage'],
        },
      },
    },
  },
});
