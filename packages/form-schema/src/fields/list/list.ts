import isPromise from "is-promise";
import { unwrapOr } from "krustykrab";
import {
	type BaseValues,
	type FieldType,
	type ParentType,
	parseSingle,
	serializeSingle,
	setFieldErrors,
	validateBeforeSubmit,
} from "../../core";
import { type ErrorMessages, defaultErrorMessages } from "../base";
import type { ListSchema } from "./schema";

function prepareValue(value: unknown): readonly unknown[] {
	const unwrapped = unwrapOr(value, []);

	if (Array.isArray(unwrapped)) {
		return unwrapped;
	}

	return [unwrapped];
}

export const list: FieldType<ListSchema<any>> = {
	createGetFieldSchema: ({ fieldSchema: { itemSchema } }) => {
		return () => itemSchema;
	},

	serializerSingle: ({
		value,
		name,
		getFieldSchema,
		getFieldType,
		parents,
	}) => {
		const arrayValue = prepareValue(value);

		return arrayValue.map((arrayValueItem, index) =>
			serializeSingle({
				values: {
					[index]: arrayValueItem,
				},
				name: String(index),
				getFieldSchema,
				getFieldType,
				parents: [
					...parents,
					{
						name,
						values: arrayValue,
					},
				],
			}),
		);
	},

	parserSingle: ({ value, name, getFieldSchema, getFieldType, parents }) => {
		const arrayValue = prepareValue(value);

		const preparsed = arrayValue.map((arrayValueItem, index) =>
			parseSingle({
				values: {
					[index]: arrayValueItem,
				},
				name: String(index),
				getFieldSchema,
				getFieldType,
				parents: [
					...parents,
					{
						name,
						values: arrayValue,
					},
				],
			}),
		);

		if (preparsed.some(isPromise)) {
			return Promise.all(preparsed);
		}

		return preparsed;
	},

	validatorBeforeSubmit: ({
		value,
		name,
		setError,
		values,
		fieldSchema,
		getFieldSchema,
		getFieldType,
		parents,
	}) => {
		const {
			errorMessages: errorMessagesParam,
			required,
			maxLength,
			minLength,
		} = fieldSchema;

		const errorMessages: ErrorMessages = {
			...defaultErrorMessages,
			...errorMessagesParam,
		};

		const arrayValue = prepareValue(value);

		if (arrayValue.length === 0) {
			if (required) {
				setError(name, parents, errorMessages.required);
			}

			return;
		}

		if (minLength && arrayValue.length < minLength) {
			setError(name, parents, errorMessages.minLength(minLength));
		}

		if (maxLength && arrayValue.length > maxLength) {
			setError(name, parents, errorMessages.maxLength(maxLength));
		}

		const nextParents: ParentType[] = [
			...parents,
			{
				name,
				values: arrayValue,
			},
		];

		validateBeforeSubmit({
			setError,
			values: arrayValue,
			names: Object.keys(arrayValue) as (keyof BaseValues)[],
			getFieldSchema,
			getFieldType,
			parents: nextParents,
		});
	},

	errorsSetter: ({
		name,
		setError,
		errors,
		fieldSchema,
		getFieldSchema,
		getFieldType,
		value,
		values,
		rawValue,
		rawValues,
		parents,
	}) => {
		const arrayValue = prepareValue(rawValue);

		const names = Object.keys(arrayValue) as (keyof BaseValues)[];

		const nextParents: ParentType[] = [
			...parents,
			{
				name,
				values: arrayValue,
			},
		];

		setFieldErrors({
			setError,
			errors: (errors[name] || {}) as Record<string, unknown>,
			names,
			getFieldSchema,
			getFieldType,
			values: prepareValue(value),
			rawValues: arrayValue,
			parents: nextParents,
		});
	},
};
