import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8', // or 'v8'
      exclude: ['**/*.cjs', '**/*.mjs', '**/*.js', 'vitest.config.ts'],
    },
  },
  plugins: [tsconfigPaths({ projects: ['tsconfig.json'] })],
});
