import type { FieldSchemaBase } from "../../core";

export type SetSchema<FieldSchema> = FieldSchemaBase & {
	schemas: Readonly<Record<string | number | symbol, FieldSchema>>;
	nested?: boolean;
};
