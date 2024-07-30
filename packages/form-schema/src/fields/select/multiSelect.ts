import type { FieldType } from "../../core";
import { type ErrorMessages, defaultErrorMessages } from "../base";
import { DEFAULT_VALUE_KEY } from "./constants";
import type { MultiSelectSchema } from "./schema";

export const multiSelect: FieldType<MultiSelectSchema<unknown>> = {
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

	parserSingle: ({
		value,
		fieldSchema: { getOptionValue, options, valueKey = DEFAULT_VALUE_KEY },
	}) => {
		if (!value) {
			return [];
		}

		const valueArr = Array.isArray(value) ? value : [value];

		return options.filter((option) => {
			if (getOptionValue) {
				const optionValue = getOptionValue(option);

				return valueArr.some(
					(valueItem) =>
						valueItem === optionValue ||
						getOptionValue(valueItem) === optionValue,
				);
			}

			const optionValue = (option as Record<string, string>)[valueKey];

			return valueArr.some(
				(valueItem) =>
					valueItem === optionValue ||
					(valueItem as Record<string, string>)[valueKey] === optionValue,
			);
		});
	},

	validatorBeforeSubmit: ({ name, setError, value, fieldSchema, parents }) => {
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
			setError(name, parents, errorMessages.required);
		}

		if (minLength && valueArr.length < minLength) {
			setError(name, parents, errorMessages.minLength(minLength));
		}

		if (maxLength && valueArr.length > maxLength) {
			setError(name, parents, errorMessages.maxLength(maxLength));
		}
	},
};
