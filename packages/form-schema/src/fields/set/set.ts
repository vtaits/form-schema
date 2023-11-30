import isPromise from "is-promise";

import {
	type FieldType,
	parse,
	serialize,
	setFieldErrors,
	validateBeforeSubmit,
} from "../../core";
import type { SetSchema } from "./schema";

export const set: FieldType<SetSchema<any>> = {
	createGetFieldSchema: ({ fieldSchema }) => {
		const { schemas } = fieldSchema;

		return (name: string) => schemas[name];
	},

	serializer: ({
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

			return {
				[name]: serialize({
					values: currentValues,
					names,
					getFieldSchema,
					getFieldType,
					parents: nextParents,
				}),
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
