import type { FieldType } from "../../core";
import { type ErrorMessages, defaultErrorMessages } from "../base";
import { DEFAULT_VALUE_KEY } from "./constants";
import type { SelectSchema } from "./schema";

export const select: FieldType<SelectSchema> = {
	serializer: ({
		name,
		values,
		fieldSchema: { getOptionValue, valueKey = DEFAULT_VALUE_KEY },
	}) => {
		const value = values[name];

		if (!value) {
			return {
				[name]: null,
			};
		}

		if (getOptionValue) {
			return {
				[name]: getOptionValue(value),
			};
		}

		return {
			[name]: (value as Record<string, string>)[valueKey],
		};
	},

	parser: ({
		name,
		values,
		fieldSchema: { getOptionValue, options, valueKey = DEFAULT_VALUE_KEY },
	}) => {
		const value = values[name];

		if (!value) {
			return {
				[name]: null,
			};
		}

		return {
			[name]: options.find((option) => {
				if (getOptionValue) {
					const optionValue = getOptionValue(option);

					return value === optionValue || getOptionValue(value) === optionValue;
				}

				const optionValue = (option as Record<string, string>)[valueKey];

				return (
					value === optionValue ||
					(value as Record<string, string>)[valueKey] === optionValue
				);
			}),
		};
	},

	validatorBeforeSubmit: ({ name, setError, values, fieldSchema, parents }) => {
		const { errorMessages: errorMessagesParam, required } = fieldSchema;

		const errorMessages: ErrorMessages = {
			...defaultErrorMessages,
			...errorMessagesParam,
		};

		const value = values[name];

		if (required && !value) {
			setError(name, parents, errorMessages.required);
		}
	},
};
