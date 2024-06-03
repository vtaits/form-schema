import type { FieldType } from "../../core";
import { type ErrorMessages, defaultErrorMessages } from "../base";
import { parseValueAndValidate, serializeDate } from "../date-base";
import {
	DEFAULT_CLIENT_DATE_FORMAT,
	DEFAULT_SERVER_DATE_FORMAT,
} from "./constants";
import type { DateSchema } from "./schema";

export const date: FieldType<DateSchema> = {
	serializerSingle: ({
		value,
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

	parserSingle: ({
		value,
		fieldSchema: {
			clientDateFormat = DEFAULT_CLIENT_DATE_FORMAT,
			serverDateFormat = DEFAULT_SERVER_DATE_FORMAT,
		},
	}) => {
		const date = parseValueAndValidate(value, serverDateFormat);

		if (date) {
			return serializeDate(date, clientDateFormat);
		}

		return null;
	},

	validatorBeforeSubmit: ({
		name,
		setError,
		value,
		fieldSchema,
		parents,
		fieldSchema: { clientDateFormat = DEFAULT_CLIENT_DATE_FORMAT },
	}) => {
		const { errorMessages: errorMessagesParam, required } = fieldSchema;

		const errorMessages: ErrorMessages = {
			...defaultErrorMessages,
			...errorMessagesParam,
		};

		const date = parseValueAndValidate(value, clientDateFormat);

		if (required && !date) {
			setError(name, parents, errorMessages.required);
		}
	},
};
