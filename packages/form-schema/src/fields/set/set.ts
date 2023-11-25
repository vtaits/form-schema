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
		values,
		fieldSchema,
		getFieldSchema,
		getFieldType,
		parents,
	}) => {
		const { schemas } = fieldSchema;

		const names = Object.keys(schemas);

		return serialize({
			values,
			names,
			getFieldSchema,
			getFieldType,
			parents,
		});
	},

	parser: ({ values, fieldSchema, getFieldSchema, getFieldType, parents }) => {
		const { schemas } = fieldSchema;

		const names = Object.keys(schemas);

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
		setError,
		values,
		fieldSchema,
		getFieldSchema,
		getFieldType,
		parents,
	}) => {
		const { schemas } = fieldSchema;

		const names = Object.keys(schemas);

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
		setError,
		errors,
		fieldSchema,
		getFieldSchema,
		getFieldType,
		values,
		rawValues,
		parents,
	}) => {
		const { schemas } = fieldSchema;

		const names = Object.keys(schemas);

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
