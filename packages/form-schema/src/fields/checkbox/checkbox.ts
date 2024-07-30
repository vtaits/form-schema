import type { FieldType } from "../../core";
import type { CheckboxSchema } from "./schema";

export function prepareValue(rawValue: unknown) {
	return Boolean(rawValue);
}

export const checkbox: FieldType<CheckboxSchema<unknown>> = {
	serializerSingle: ({ fieldSchema: { isValueInverse }, value }) => {
		const prevaredValue = prepareValue(value);

		if (isValueInverse) {
			return !prevaredValue;
		}

		return prevaredValue;
	},

	parserSingle: ({ fieldSchema: { isValueInverse }, value }) => {
		const prevaredValue = prepareValue(value);

		if (isValueInverse) {
			return !prevaredValue;
		}

		return prevaredValue;
	},
};
