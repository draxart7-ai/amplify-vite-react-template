/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Optional: enables global test functions
    environment: "jsdom",
    setupFiles: ["./src/tests/setup.ts"], // Path to your setup file (created in step 3)
    coverage: {
      enabled: true,
      reporter: ["text", "html"], // Generates a text output in console and an HTML report
      include: ["src/**"], // Recommended: specify which files to include
      exclude: [
        "src/tests/**",
        "src/constants.ts",
        "src/main.tsx",
        "src/vite-env.d.ts",
      ],
    },
  },
});
