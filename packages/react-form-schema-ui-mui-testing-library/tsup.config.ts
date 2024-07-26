import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
  },
  sourcemap: true,
  format: ['esm', 'cjs'],
  dts: true,
  legacyOutput: true,
});
