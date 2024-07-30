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

export const input: FieldType<InputSchema<unknown>> = {
	serializerSingle: ({ value, fieldSchema: { isNumber } }) => {
		const strValue = prepareValue(value);

		if (isNumber) {
			const numericValue = Number.parseFloat(strValue);

			if (Number.isNaN(numericValue)) {
				return null;
			}

			return numericValue;
		}

		return strValue;
	},

	parserSingle: ({ value }) => prepareValue(value),

	validatorBeforeSubmit: ({ name, setError, value, fieldSchema, parents }) => {
		const {
			errorMessages: errorMessagesParam,
			isNumber,
			required,
			regExp: regExpParam,
			maxLength,
			minLength,
		} = fieldSchema;

		const errorMessages: ErrorMessages = {
			...defaultErrorMessages,
			...errorMessagesParam,
		};

		const strValue = prepareValue(value);

		if (isNumber && strValue && Number.isNaN(Number.parseFloat(strValue))) {
			setError(name, parents, errorMessages.invalidNumber);
		}

		if (required && !strValue) {
			setError(name, parents, errorMessages.required);
		}

		if (minLength && strValue.length < minLength) {
			setError(name, parents, errorMessages.minLengthStr(minLength));
		}

		if (maxLength && strValue.length > maxLength) {
			setError(name, parents, errorMessages.maxLengthStr(maxLength));
		}

		if (regExpParam) {
			const regExp =
				regExpParam instanceof RegExp ? regExpParam : new RegExp(regExpParam);

			if (!regExp.test(strValue)) {
				setError(name, parents, errorMessages.regexp(regExp.toString()));
			}
		}
	},
};
