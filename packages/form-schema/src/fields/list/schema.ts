import type { BaseFieldSchema } from "../base";

export type ListSchema<FormApi, FieldSchema> = BaseFieldSchema<
	FormApi,
	readonly unknown[]
> & {
	maxLength?: number;
	minLength?: number;
	initialItem?: unknown;
	itemSchema: FieldSchema;
};
