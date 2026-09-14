import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const tailwindcss = (await import('@tailwindcss/vite')).default;
  return {
    plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
      '@context': path.resolve(__dirname, './src/context'),
    },
  },
  server: {
    port: 3000,
    open: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        // Split stable vendor libs into their own chunks so repeat visits
        // reuse cached vendor JS across app-code deploys.
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          motion: ['motion'],
          query: ['@tanstack/react-query'],
        },
      },
    },
  },
  envPrefix: 'VITE_',
  };
});
