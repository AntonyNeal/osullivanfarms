import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import removeConsole from 'vite-plugin-remove-console';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    react({
      include: ['**/*.tsx', '**/*.ts'],
    }),
    removeConsole(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    cors: true,
    port: 5173,
    fs: {
      strict: true,
    },
  },
  envPrefix: 'VITE_',
  envDir: './',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react-router-dom')
          ) {
            return 'vendor';
          }
          if (id.includes('react-ga4')) {
            return 'analytics';
          }
          if (
            id.includes('@headlessui') ||
            id.includes('@heroicons') ||
            id.includes('lucide-react')
          ) {
            return 'ui';
          }
          if (id.includes('@tanstack/react-query')) {
            return 'query';
          }
          if (id.includes('node_modules')) {
            return 'vendor-misc';
          }
        },
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: false,
        passes: 3,
        dead_code: true,
        unused: true,
      },
      mangle: {
        safari10: true,
        reserved: ['gtag', 'dataLayer', 'ga', 'fbq'],
      },
      format: {
        comments: false,
      },
    },
    cssCodeSplit: true,
    cssMinify: true,
    modulePreload: {
      polyfill: false,
    },
    target: 'es2020',
    reportCompressedSize: true,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  preview: {
    port: 5174,
    strictPort: true,
  },
  esbuild: {
    logLevel: 'info',
    target: 'esnext',
    drop: [],
  },
});
