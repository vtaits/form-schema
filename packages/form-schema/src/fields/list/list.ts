export { ListSchema } from './schema';
import isPromise from "is-promise";
import { unwrapOr } from "krustykrab";
import {
	type FieldType,
	parse,
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
	createGetFieldSchema: ({ itemSchema }) => {
		return () => itemSchema;
	},

	serializerSingle: ({
		value,
		name,
		values,
		itemSchema,
		getFieldSchema,
		getFieldType,
		parents,
	}) => {
		const arrayValue = prepareValue(value);

		const { itemSchema } = fieldSchema;

		return arrayValue.map((arrayValueItem, index) => serializeSingle({
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
		}));
	},

	parser: ({
		name,
		values,
		fieldSchema,
		getFieldSchema,
		getFieldType,
		parents,
	}) => {
		const { schemas, nested } = fieldSchema;

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

			const parseResult = parse({
				values: currentValues,
				names,
				getFieldSchema,
				getFieldType,
				parents: nextParents,
			});

			if (!parseResult) {
				return {
					[name]: {},
				};
			}

			if (isPromise(parseResult)) {
				return parseResult.then((promiseResult) => ({
					[name]: promiseResult,
				}));
			}

			return {
				[name]: parseResult,
			};
		}

		return (
			parse({
				values,
				names,
				getFieldSchema,
				getFieldType,
				parents,
			}) || {}
		);
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
