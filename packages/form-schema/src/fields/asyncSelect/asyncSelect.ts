import type { FieldType } from "../../core";
import { defaultErrorMessages, type ErrorMessages } from "../base";
import { DEFAULT_VALUE_KEY } from "./constants";
import type { AsyncSelectSchema } from "./schema";

export const asyncSelect: FieldType<AsyncSelectSchema<unknown>> = {
	serializerSingle: ({
		value,
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

	parserSingle: ({ value, fieldSchema: { loadSingleOption } }) => {
		if (!value) {
			return null;
		}

		if (loadSingleOption) {
			return loadSingleOption(value);
		}

		return value;
	},

	validatorBeforeSubmit: ({ setCurrentError, value, fieldSchema }) => {
		const { errorMessages: errorMessagesParam, required } = fieldSchema;

		const errorMessages: ErrorMessages = {
			...defaultErrorMessages,
			...errorMessagesParam,
		};

		if (required && !value) {
			setCurrentError(errorMessages.required);
		}
	},
};
