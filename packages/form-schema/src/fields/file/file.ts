import type { FieldType } from "../../core";
import { defaultErrorMessages, type ErrorMessages } from "../base";
import type { FileFieldValue, FileSchema } from "./schema";

export function prepareValue(rawValue: unknown) {
	if (!rawValue) {
		return null;
	}

	const fileValue = rawValue as FileFieldValue;

	if (fileValue.file) {
		return fileValue.file;
	}

	if (fileValue.hasPreviousFile) {
		return undefined;
	}

	return null;
}

export const file: FieldType<FileSchema<unknown>> = {
	serializerSingle: ({ value }) => {
		return prepareValue(value);
	},

	parserSingle: ({ value }) => {
		if (!value) {
			return {
				file: null,
				hasPreviousFile: false,
			} satisfies FileFieldValue;
		}

		if (value instanceof Blob) {
			return {
				file: value,
				hasPreviousFile: true,
			} satisfies FileFieldValue;
		}

		if (typeof value === "string") {
			return {
				file: null,
				name: value,
				hasPreviousFile: true,
			} satisfies FileFieldValue;
		}

		if (typeof value === "object") {
			return {
				file: null,
				hasPreviousFile: true,
				...value,
			} satisfies FileFieldValue;
		}
	},

	validatorBeforeSubmit: ({ setCurrentError, value, fieldSchema }) => {
		const {
			errorMessages: errorMessagesParam,
			required,
			maxSize,
			minSize,
		} = fieldSchema;

		const errorMessages: ErrorMessages = {
			...defaultErrorMessages,
			...errorMessagesParam,
		};

		const fileValue = prepareValue(value);

		if (
			required &&
			((fileValue === undefined &&
				!(value as FileFieldValue)?.hasPreviousFile) ||
				fileValue === null)
		) {
			setCurrentError(errorMessages.required);
		}

		if (fileValue) {
			if (minSize && fileValue.size < minSize) {
				setCurrentError(errorMessages.minLengthFile(minSize));
			}

			if (maxSize && fileValue.size > maxSize) {
				setCurrentError(errorMessages.maxLengthFile(maxSize));
			}
		}
	},
};
