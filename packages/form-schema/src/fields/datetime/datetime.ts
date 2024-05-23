import type { FieldType } from "../../core";
import { type ErrorMessages, defaultErrorMessages } from "../base";
import { parseValueAndValidate, serializeDate } from "../date-base";
import {
	DEFAULT_CLIENT_DATE_FORMAT,
	DEFAULT_SERVER_DATE_FORMAT,
} from "./constants";
import type { DateTimeSchema } from "./schema";

export const datetime: FieldType<DateTimeSchema> = {
	serializerSingle: ({
		value,
		name,
		values,
		fieldSchema: {
			clientDateFormat = DEFAULT_CLIENT_DATE_FORMAT,
			serverDateFormat = DEFAULT_SERVER_DATE_FORMAT,
		},
	}) => {
		const date = parseValueAndValidate(value, clientDateFormat);

		if (date) {
			return serializeDate(date, serverDateFormat);
		}

		return null;
	},

	parser: ({
		name,
		values,
		fieldSchema: {
			clientDateFormat = DEFAULT_CLIENT_DATE_FORMAT,
			serverDateFormat = DEFAULT_SERVER_DATE_FORMAT,
		},
	}) => {
		const value = values[name];

		const date = parseValueAndValidate(value, serverDateFormat);

		return {
			[name]: date ? serializeDate(date, clientDateFormat) : null,
		};
	},

	validatorBeforeSubmit: ({
		name,
		setError,
		values,
		fieldSchema,
		parents,
		fieldSchema: { clientDateFormat = DEFAULT_CLIENT_DATE_FORMAT },
	}) => {
		const { errorMessages: errorMessagesParam, required } = fieldSchema;

		const errorMessages: ErrorMessages = {
			...defaultErrorMessages,
			...errorMessagesParam,
		};

		const value = parseValueAndValidate(values[name], clientDateFormat);

		if (required && !value) {
			setError(name, parents, errorMessages.required);
		}
	},
};
