import type { FieldType } from "../../core";
import type { CheckboxSchema } from "./schema";

export function prepareValue(rawValue: unknown) {
	return Boolean(rawValue);
}

export const checkbox: FieldType<CheckboxSchema> = {
	serializer: ({ name, values }) => {
		const value = values[name];

		return {
			[name]: prepareValue(value),
		};
	},

	parser: ({ name, values }) => {
		const value = values[name];

		return {
			[name]: prepareValue(value),
		};
	},
};
