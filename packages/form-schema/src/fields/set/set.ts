import { isPromise } from "es-toolkit";
import {
	type BaseValues,
	type FieldType,
	type ParentType,
	parse,
	serialize,
	setFieldErrors,
	setValues,
	validateBeforeSubmit,
} from "../../core";
import type { SetSchema } from "./schema";

export const set: FieldType<SetSchema<any>> = {
	createGetFieldSchema: ({ fieldSchema }) => {
		const { schemas } = fieldSchema;

		return (name) => schemas[name];
	},

	serializer: async ({
		name,
		value,
		values,
		fieldSchema,
		getFieldSchema,
		getFieldType,
		parents,
	}) => {
		const { schemas, nested } = fieldSchema;

		const names = Object.keys(schemas) as (keyof BaseValues)[];

		if (nested) {
			const currentValues = (value || {}) as Record<string, unknown>;

			const nextParents = [
				...parents,
				{
					name,
					values: currentValues,
				},
			];

			const result = await serialize({
				values: currentValues,
				names,
				getFieldSchema,
				getFieldType,
				parents: nextParents,
			});

			return {
				[name]: result,
			};
		}

		return serialize({
			values,
			names,
			getFieldSchema,
			getFieldType,
			parents,
		});
	},

	parser: ({
		name,
		value,
		values,
		fieldSchema,
		getFieldSchema,
		getFieldType,
		parents,
	}) => {
		const { schemas, nested } = fieldSchema;

		const names = Object.keys(schemas);

		if (nested) {
			const currentValues = (value || {}) as Record<string, unknown>;

			const nextParents: ParentType[] = [
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
		value,
		values,
		fieldSchema,
		getFieldSchema,
		getFieldType,
		parents,
	}) => {
		const { nested, schemas } = fieldSchema;

		const names = Object.keys(schemas) as (keyof BaseValues)[];

		if (nested) {
			const currentValues = (value || {}) as Record<string, unknown>;

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
		value,
		values,
		rawValue,
		rawValues,
		parents,
	}) => {
		const { nested, schemas } = fieldSchema;

		const names = Object.keys(schemas) as (keyof BaseValues)[];

		if (nested) {
			const currentValues = (value || {}) as Record<string, unknown>;

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
				rawValues: (rawValue || {}) as Record<string, unknown>,
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

	valueSetter: ({
		name,
		setValue,
		fieldSchema,
		getFieldSchema,
		getFieldType,
		value,
		values,
		parents,
	}) => {
		const { nested, schemas } = fieldSchema;

		const names = Object.keys(schemas) as (keyof BaseValues)[];

		if (nested) {
			const currentValues = (value || {}) as Record<string, unknown>;

			const nextParents = [
				...parents,
				{
					name,
					values: currentValues,
				},
			];

			setValues({
				setValue,
				names,
				getFieldSchema,
				getFieldType,
				values: currentValues,
				parents: nextParents,
			});

			return;
		}

		setValues({
			setValue,
			names,
			getFieldSchema,
			getFieldType,
			values,
			parents,
		});
	},
};
