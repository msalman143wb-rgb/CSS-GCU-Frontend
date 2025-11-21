import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Remove all the import.meta.url stuff and use CommonJS
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  root: ".",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    port: 3000,
  },
});