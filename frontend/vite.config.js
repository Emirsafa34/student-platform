// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';
import path from 'path';

export default defineConfig({
  plugins: [
    vue(),
    legacy({
      targets: ['defaults', 'not IE 11'],
      // gerekirse ek polyfill’ler de ekleyebilirsiniz:
      // additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    fs: {
      allow: [
        process.cwd(),
        path.resolve(__dirname, 'node_modules'),
        path.resolve(__dirname, '../node_modules'),
      ],
    },
  },
});
