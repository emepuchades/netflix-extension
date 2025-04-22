import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        // eslint-disable-next-line no-undef
        popup: resolve(__dirname, 'popup.html'),
        // eslint-disable-next-line no-undef
        inject: resolve(__dirname, 'src/inject.js'),
      },
      output: {
        entryFileNames: 'assets/[name].js',
      },
    },
    outDir: 'dist',
  }
});
