import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',
  publicDir: resolve(__dirname, 'public'),
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@models': resolve(__dirname, 'src/js/models'),
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 4200,
    open: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '',
      },
    },
  },
});
