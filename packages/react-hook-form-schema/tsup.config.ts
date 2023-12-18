import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    core: "src/core/index.ts",
    fields_checkbox: "src/fields/checkbox/index.ts",
    fields_dynamic: "src/fields/dynamic/index.ts",
    fields_input: "src/fields/input/index.ts",
    fields_set: "src/fields/set/index.ts",
    fields_select: "src/fields/select/index.ts",
    fields_textarea: "src/fields/textarea/index.ts",
  },
  sourcemap: true,
  format: ['esm', 'cjs'],
  dts: true,
  legacyOutput: true,
});
