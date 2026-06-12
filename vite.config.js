import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        week1: 'Week_One/index.html',
        week2: 'Week_Two/index.html',
        week3: 'Week_three/index.html',
        week4: 'Week_Four/index.html'
      }
    }
  }
});
