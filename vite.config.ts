import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      formats: ["es"],
      fileName: () => "main.js"
    },
    rollupOptions: {
      external: [],
      output: {
        assetFileNames: "[name].[ext]",
        entryFileNames: "main.js"
      }
    }
  }
});
