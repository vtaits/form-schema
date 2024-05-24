import type { FieldType } from "../../core";
import type { CheckboxSchema } from "./schema";

export function prepareValue(rawValue: unknown) {
	return Boolean(rawValue);
}

export const checkbox: FieldType<CheckboxSchema> = {
	serializerSingle: ({ value }) => prepareValue(value),
	parserSingle: ({ value }) => prepareValue(value),
};
