import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'
import vercel from 'vite-plugin-vercel';

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
    vercel()],
  server: {
    open: true,
    port: process.env.PORT,
    allowedHosts: true,
    host: true
  },
  resolve: {
    alias: {
      screens: path.resolve(__dirname, './src/screens'),
      "@": path.resolve(__dirname, "./src")
    },
  },
  build: {
    outDir: 'build',
  },
});