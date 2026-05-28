import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    nitro({
      config: {
        preset: 'node-server',
        routeRules: {
          '/assets/**': {
            headers: {
              'cache-control': 'public, max-age=31536000, immutable',
            },
          },
        },
      },
    }),
    tanstackStart(),
    react(),
  ],
});
