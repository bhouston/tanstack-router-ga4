import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'library',
          include: ['packages/tanstack-router-ga4/src/**/*.test.ts', 'packages/tanstack-router-ga4/src/**/*.test.tsx'],
          exclude: ['**/e2e/**'],
          environment: 'jsdom',
          coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov'],
            reportsDirectory: './coverage',
            include: ['packages/tanstack-router-ga4/src/**/*.ts', 'packages/tanstack-router-ga4/src/**/*.tsx'],
            exclude: ['**/*.test.ts', '**/*.test.tsx', '**/*.d.ts', '**/index.ts'],
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      'tanstack-router-ga4': path.join(rootDir, 'packages/tanstack-router-ga4/src/index.ts'),
    },
  },
});
