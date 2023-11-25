import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    core: "src/core/index.ts",
    fields_dynamic: "src/fields/dynamic/index.ts",
    fields_set: "src/fields/set/index.ts",
  },
  sourcemap: true,
  format: ['esm', 'cjs'],
  dts: true,
  legacyOutput: true,
});
