import isPromise from "is-promise";
import { unwrapOr } from "krustykrab";
import {
	type FieldType,
	parse,
	parseSingle,
	serializeSingle,
	setFieldErrors,
	validateBeforeSubmit,
} from "../../core";
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
				value: arrayValueItem,
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
						values: value,
					},
				],
			}),
		);
	},

	parserSingle: ({
		value,
		name,
		values,
		getFieldSchema,
		getFieldType,
		parents,
	}) => {
		const arrayValue = prepareValue(value);

		const preparsed = arrayValue.map((arrayValueItem, index) =>
			parseSingle({
				value: arrayValueItem,
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
						values: value,
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
		name,
		setError,
		values,
		fieldSchema,
		getFieldSchema,
		getFieldType,
		parents,
	}) => {
		const { nested, schemas } = fieldSchema;

		const names = Object.keys(schemas);

		if (nested) {
			const currentValues = (values[name] || {}) as Record<string, unknown>;

			const nextParents = [
				...parents,
				{
					name,
					values: currentValues,
				},
			];

			validateBeforeSubmit({
				setError,
				values: currentValues,
				names,
				getFieldSchema,
				getFieldType,
				parents: nextParents,
			});

			return;
		}

		validateBeforeSubmit({
			setError,
			values,
			names,
			getFieldSchema,
			getFieldType,
			parents,
		});
	},

	errorsSetter: ({
		name,
		setError,
		errors,
		fieldSchema,
		getFieldSchema,
		getFieldType,
		values,
		rawValues,
		parents,
	}) => {
		const { nested, schemas } = fieldSchema;

		const names = Object.keys(schemas);

		if (nested) {
			const currentValues = (values[name] || {}) as Record<string, unknown>;

			const nextParents = [
				...parents,
				{
					name,
					values: currentValues,
				},
			];

			setFieldErrors({
				setError,
				errors: (errors[name] || {}) as Record<string, unknown>,
				names,
				getFieldSchema,
				getFieldType,
				values: currentValues,
				rawValues: (rawValues[name] || {}) as Record<string, unknown>,
				parents: nextParents,
			});

			return;
		}

		setFieldErrors({
			setError,
			errors,
			names,
			getFieldSchema,
			getFieldType,
			values,
			rawValues,
			parents,
		});
	},
};
