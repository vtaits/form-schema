import type { BaseFieldSchema } from "../base";

export type ListSchema<FieldSchema> = BaseFieldSchema & {
	maxLength?: number;
	minLength?: number;
	initialItem?: unknown;
	itemSchema: FieldSchema;
};
