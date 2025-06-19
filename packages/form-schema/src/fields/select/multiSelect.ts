import type { FieldType } from "../../core";
import { defaultErrorMessages, type ErrorMessages } from "../base";
import { DEFAULT_VALUE_KEY } from "./constants";
import type { MultiSelectSchema } from "./schema";

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
		const valueArr = parseValueArray(value);

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
