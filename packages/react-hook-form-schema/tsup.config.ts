import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    core: "src/core/index.ts",
    fields_asyncSelect: "src/fields/asyncSelect/index.ts",
    fields_base: "src/fields/base/index.ts",
    fields_checkbox: "src/fields/checkbox/index.ts",
    fields_checkboxGroup: "src/fields/checkboxGroup/index.ts",
    fields_date: "src/fields/date/index.ts",
    fields_datetime: "src/fields/datetime/index.ts",
    fields_dynamic: "src/fields/dynamic/index.ts",
    fields_file: "src/fields/file/index.ts",
    fields_input: "src/fields/input/index.ts",
    fields_list: "src/fields/list/index.ts",
    fields_radioGroup: "src/fields/radioGroup/index.ts",
    fields_set: "src/fields/set/index.ts",
    fields_select: "src/fields/select/index.ts",
    fields_tags: "src/fields/tags/index.ts",
    fields_textarea: "src/fields/textarea/index.ts",
    form: "src/form/index.ts",
    utils: "src/utils/index.ts",
  },
  sourcemap: true,
  format: ['esm'],
  dts: true,
});
