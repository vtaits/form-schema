import type { FieldType } from "../../core";
import { defaultErrorMessages, type ErrorMessages } from "../base";
import type { TagsSchema } from "./schema";

export function prepareValue(rawValue: unknown) {
	const arrayValue = rawValue
		? Array.isArray(rawValue)
			? rawValue
			: [rawValue]
		: [];

	return arrayValue
		.map((rawValue) => {
			if (typeof rawValue === "number" || typeof rawValue === "boolean") {
				return String(rawValue);
			}

			if (typeof rawValue === "string") {
				return rawValue;
			}

			return "";
		})
		.filter(Boolean);
}

export const tags: FieldType<TagsSchema<unknown>> = {
	serializerSingle: ({ value }) => prepareValue(value),

	parserSingle: ({ value }) => prepareValue(value),

	validatorBeforeSubmit: ({ setCurrentError, value, fieldSchema }) => {
		const { errorMessages: errorMessagesParam, required } = fieldSchema;

		const errorMessages: ErrorMessages = {
			...defaultErrorMessages,
			...errorMessagesParam,
		};

		const arrayValue = prepareValue(value);

		if (required && arrayValue.length === 0) {
			setCurrentError(errorMessages.required);
		}
	},
};
