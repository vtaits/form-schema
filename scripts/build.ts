import { $ } from "bun";

await Promise.all([
  await $`bun --filter='@vtaits/form-schema' run build`,
  await $`bun --filter='@vtaits/react-form-schema-base-ui' run build`,
]);
await Promise.all([
  await $`bun --filter='@vtaits/react-hook-form-schema' run build`,
  await $`bun --filter='@vtaits/react-form-schema-base-ui' run build`,
  await $`bun --filter='@vtaits/react-form-schema-ui-antd' run build`,
  await $`bun --filter='@vtaits/react-form-schema-ui-mui' run build`,
  await $`bun --filter='@vtaits/react-form-schema-ui-mui-playwright' run build`,
]);
