import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["packages/**/*.test.ts", "packages/**/*.test.tsx"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      reportsDirectory: "./coverage",
      include: [
        "packages/tanstack-router-google-analytics/src/**/*.ts",
        "packages/tanstack-router-google-analytics/src/**/*.tsx",
      ],
      exclude: ["**/*.test.ts", "**/*.test.tsx", "**/*.d.ts", "**/index.ts"],
    },
  },
  resolve: {
    alias: {
      "tanstack-router-google-analytics": path.join(
        rootDir,
        "packages/tanstack-router-google-analytics/src/index.ts",
      ),
    },
  },
});
