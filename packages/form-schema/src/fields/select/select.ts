import type { FieldType } from "../../core";
import { type ErrorMessages, defaultErrorMessages } from "../base";
import { DEFAULT_VALUE_KEY } from "./constants";
import type { SelectSchema } from "./schema";

export const select: FieldType<SelectSchema<unknown>> = {
	serializerSingle: ({
		value,
		name,
		values,
		fieldSchema: { getOptionValue, valueKey = DEFAULT_VALUE_KEY },
	}) => {
		if (!value) {
			return null;
		}

		if (getOptionValue) {
			return getOptionValue(value);
		}

		return (value as Record<string, string>)[valueKey];
	},

	parserSingle: ({
		value,
		fieldSchema: { getOptionValue, options, valueKey = DEFAULT_VALUE_KEY },
	}) => {
		if (!value) {
			return null;
		}

		return options.find((option) => {
			if (getOptionValue) {
				const optionValue = getOptionValue(option);

				return value === optionValue || getOptionValue(value) === optionValue;
			}

			const optionValue = (option as Record<string, string>)[valueKey];

			return (
				value === optionValue ||
				(value as Record<string, string>)[valueKey] === optionValue
			);
		});
	},

	validatorBeforeSubmit: ({ name, setError, value, fieldSchema, parents }) => {
		const { errorMessages: errorMessagesParam, required } = fieldSchema;

		const errorMessages: ErrorMessages = {
			...defaultErrorMessages,
			...errorMessagesParam,
		};

		if (required && !value) {
			setError(name, parents, errorMessages.required);
		}
	},
};
