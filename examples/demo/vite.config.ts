import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import viteTsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [nitro(), viteTsconfigPaths(), tanstackStart(), react()],
});
