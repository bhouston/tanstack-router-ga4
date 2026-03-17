import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    globalSetup: [path.join(rootDir, "scripts", "e2e-server.ts")],
    projects: [
      {
        name: "library",
        test: {
          include: ["packages/**/*.test.ts", "packages/**/*.test.tsx"],
          exclude: ["**/e2e/**"],
          environment: "jsdom",
          coverage: {
            provider: "v8",
            reporter: ["text", "lcov"],
            reportsDirectory: "./coverage",
            include: [
              "packages/tanstack-router-ga4/src/**/*.ts",
              "packages/tanstack-router-ga4/src/**/*.tsx",
            ],
            exclude: ["**/*.test.ts", "**/*.test.tsx", "**/*.d.ts", "**/index.ts"],
          },
        },
      },
      {
        name: "demo",
        test: {
          include: ["packages/example-website/e2e/**/*.test.ts"],
          environment: "node",
          testTimeout: 60_000,
        },
      },
    ],
  },
  resolve: {
    alias: {
      "tanstack-router-ga4": path.join(
        rootDir,
        "packages/tanstack-router-ga4/src/index.ts",
      ),
    },
  },
});
