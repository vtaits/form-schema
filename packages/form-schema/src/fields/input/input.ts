import type { FieldType } from "../../core";
import { type ErrorMessages, defaultErrorMessages } from "../base";
import type { InputSchema } from "./schema";

export function prepareValue(rawValue: unknown) {
	if (typeof rawValue === "number" || typeof rawValue === "boolean") {
		return String(rawValue);
	}

	if (typeof rawValue === "string") {
		return rawValue;
	}

	return "";
}

export const input: FieldType<InputSchema> = {
	serializerSingle: ({ value }) => prepareValue(value),

	parserSingle: ({ value }) => prepareValue(value),

	validatorBeforeSubmit: ({ name, setError, values, fieldSchema, parents }) => {
		const {
			errorMessages: errorMessagesParam,
			required,
			regExp: regExpParam,
			maxLength,
			minLength,
		} = fieldSchema;

		const errorMessages: ErrorMessages = {
			...defaultErrorMessages,
			...errorMessagesParam,
		};

		const value = prepareValue(values[name]);

		if (required && !value) {
			setError(name, parents, errorMessages.required);
		}

		if (minLength && value.length < minLength) {
			setError(name, parents, errorMessages.minLengthStr(minLength));
		}

		if (maxLength && value.length > maxLength) {
			setError(name, parents, errorMessages.maxLengthStr(maxLength));
		}

		if (regExpParam) {
			const regExp =
				regExpParam instanceof RegExp ? regExpParam : new RegExp(regExpParam);

			if (!regExp.test(value)) {
				setError(name, parents, errorMessages.regexp(regExp.toString()));
			}
		}
	},
};
