import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    core: "src/core/index.ts",
    fields_base: "src/fields/base/index.ts",
    fields_checkbox: "src/fields/checkbox/index.ts",
    fields_date: "src/fields/date/index.ts",
    fields_datetime: "src/fields/datetime/index.ts",
    'fields_date-base': "src/fields/date-base/index.ts",
    fields_dynamic: "src/fields/dynamic/index.ts",
    fields_input: "src/fields/input/index.ts",
    fields_select: "src/fields/select/index.ts",
    fields_set: "src/fields/set/index.ts",
  },
  sourcemap: true,
  format: ['esm', 'cjs'],
  dts: true,
  legacyOutput: true,
});
