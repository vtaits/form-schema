import {
	type CreateGetFieldSchemaParams,
	type FieldType,
	type GetFieldSchema,
	parse,
	serialize,
	setFieldErrors,
	validateBeforeSubmit,
} from "../../core";
import type { DynamicSchema } from "./schema";

export function createGetFieldSchema<
	FormApi,
	FieldSchema extends DynamicSchema<any, any>,
	Values extends Record<string, any>,
	RawValues extends Record<string, any>,
	SerializedValues extends Record<string, any>,
	Errors extends Record<string, any>,
>({
	fieldSchema,
	getFieldSchema,
	getFieldType,
	values,
	phase,
	parents,
}: CreateGetFieldSchemaParams<
	FieldSchema,
	Values,
	RawValues,
	SerializedValues,
	Errors
>): GetFieldSchema<FieldSchema> {
	const { getSchema } = fieldSchema as DynamicSchema<
		FormApi,
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors
	>;

	const resultSchema = getSchema(
		values,
		phase,
		getFieldSchema,
		getFieldType,
		parents,
	);

	if (!resultSchema) {
		return getFieldSchema;
	}

	return () => resultSchema;
}

export const dynamic: FieldType<DynamicSchema<any, any>> = {
	createGetFieldSchema,

	serializer: ({
		values,
		name,
		fieldSchema,
		getFieldSchema,
		getFieldType,
		parents,
	}) => {
		const { getSchema } = fieldSchema;

		const resultSchema = getSchema(
			values,
			"serialize",
			getFieldSchema,
			getFieldType,
			parents,
		);

		if (!resultSchema) {
			return {};
		}

		return serialize({
			values,
			names: [name],
			getFieldSchema,
			getFieldType,
			parents,
		});
	},

	parser: ({
		values,
		name,
		fieldSchema,
		getFieldSchema,
		getFieldType,
		parents,
	}) => {
		const { getSchema, getSchemaAsync } = fieldSchema;

		if (getSchemaAsync) {
			return getSchemaAsync(
				values,
				"parse",
				getFieldSchema,
				getFieldType,
				parents,
			).then((resultSchema) => {
				if (!resultSchema) {
					return {};
				}

				return parse({
					values,
					names: [name],
					getFieldSchema,
					getFieldType,
					parents,
				});
			});
		}

		const resultSchema = getSchema(
			values,
			"parse",
			getFieldSchema,
			getFieldType,
			parents,
		);

		if (!resultSchema) {
			return {};
		}

		return parse({
			values,
			names: [name],
			getFieldSchema,
			getFieldType,
			parents,
		});
	},

	validatorBeforeSubmit: ({
		setError,
		values,
		name,
		fieldSchema,
		getFieldSchema,
		getFieldType,
		parents,
	}) => {
		const { getSchema } = fieldSchema as DynamicSchema<any, any>;

		const resultSchema = getSchema(
			values,
			"serialize",
			getFieldSchema,
			getFieldType,
			parents,
		);

		if (!resultSchema) {
			return {};
		}

		validateBeforeSubmit({
			setError,
			values,
			names: [name],
			getFieldSchema,
			getFieldType,
			parents,
		});
	},

	errorsSetter: ({
		setError,
		errors,
		name,
		fieldSchema,
		getFieldSchema,
		getFieldType,
		values,
		rawValues,
		parents,
	}) => {
		const { getSchema } = fieldSchema;

		const resultSchema = getSchema(
			rawValues,
			"serialize",
			getFieldSchema,
			getFieldType,
			parents,
		);

		if (!resultSchema) {
			return {};
		}

		setFieldErrors({
			setError,
			errors,
			names: [name],
			getFieldSchema,
			getFieldType,
			values,
			rawValues,
			parents,
		});
	},
};
