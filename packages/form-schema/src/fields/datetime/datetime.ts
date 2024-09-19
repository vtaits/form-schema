import { UTCDate } from "@date-fns/utc";
import type { FieldType } from "../../core";
import { type ErrorMessages, defaultErrorMessages } from "../base";
import { parseValueAndValidate, serializeDate } from "../date-base";
import {
	DEFAULT_CLIENT_DATE_FORMAT,
	DEFAULT_SERVER_DATE_FORMAT,
} from "./constants";
import type { DateTimeSchema } from "./schema";

export const datetime: FieldType<DateTimeSchema<unknown>> = {
	serializerSingle: ({
		value,
		fieldSchema: {
			clientDateFormat = DEFAULT_CLIENT_DATE_FORMAT,
			serverDateFormat = DEFAULT_SERVER_DATE_FORMAT,
			utc,
		},
	}) => {
		const date = parseValueAndValidate(value, clientDateFormat);

		if (date) {
			return serializeDate(utc ? new UTCDate(date) : date, serverDateFormat);
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
		value,
		setCurrentError,
		fieldSchema,
		fieldSchema: { clientDateFormat = DEFAULT_CLIENT_DATE_FORMAT },
	}) => {
		const { errorMessages: errorMessagesParam, required } = fieldSchema;

		const errorMessages: ErrorMessages = {
			...defaultErrorMessages,
			...errorMessagesParam,
		};

		const date = parseValueAndValidate(value, clientDateFormat);

		if (required && !date) {
			setCurrentError(errorMessages.required);
		}
	},
};
