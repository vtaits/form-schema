import type { FieldType } from "../../core";
import { type ErrorMessages, defaultErrorMessages } from "../base";
import { DEFAULT_VALUE_KEY } from "./constants";
import type { AsyncMultiSelectSchema } from "./schema";

function parseValueArray(value: unknown) {
	if (value === null || value === undefined) {
		return [];
	}

	if (Array.isArray(value)) {
		return value;
	}

	if (typeof value === "object") {
		return Object.values(value);
	}

	return [value];
}

export const asyncMultiSelect: FieldType<AsyncMultiSelectSchema<unknown>> = {
	serializerSingle: ({
		value,
		fieldSchema: { getOptionValue, valueKey = DEFAULT_VALUE_KEY },
	}) => {
		if (!value) {
			return [];
		}

		const valueArr = Array.isArray(value) ? value : [value];

		if (getOptionValue) {
			return valueArr.map(getOptionValue);
		}

		return valueArr.map(
			(valueItem) => (valueItem as Record<string, string>)[valueKey],
		);
	},

	parserSingle: ({ value, fieldSchema: { loadSingleOption } }) => {
		const valueArr = parseValueArray(value);

		return Promise.all(
			valueArr.map((value) => {
				if (!value) {
					return null;
				}

				if (loadSingleOption) {
					return loadSingleOption(value);
				}

				return value;
			}),
		).then((parsedValues) => parsedValues.filter(Boolean));
	},

	validatorBeforeSubmit: ({ setCurrentError, value, fieldSchema }) => {
		const {
			errorMessages: errorMessagesParam,
			minLength,
			maxLength,
			required,
		} = fieldSchema;

		const errorMessages: ErrorMessages = {
			...defaultErrorMessages,
			...errorMessagesParam,
		};

		const valueArr = Array.isArray(value) ? value : [value];

		if (required && valueArr.length === 0) {
			setCurrentError(errorMessages.required);
		}

		if (minLength && valueArr.length < minLength) {
			setCurrentError(errorMessages.minLength(minLength));
		}

		if (maxLength && valueArr.length > maxLength) {
			setCurrentError(errorMessages.maxLength(maxLength));
		}
	},
};
