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

export async function createGetFieldSchema<
	FormApi,
	FieldSchema extends DynamicSchema<any, any>,
	Values extends Record<string, any>,
	RawValues extends Record<string, any>,
	SerializedValues extends Record<string, any>,
	Errors extends Record<string, any>,
>({
	dependencies,
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
>): Promise<GetFieldSchema<FieldSchema>> {
	const { getSchema } = fieldSchema as DynamicSchema<
		FormApi,
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors
	>;

	const resultSchema = await getSchema({
		dependencies,
		values,
		phase,
		getFieldSchema,
		getFieldType,
		parents,
	});

	if (!resultSchema) {
		return getFieldSchema;
	}

	return () => resultSchema;
}

export const dynamic: FieldType<DynamicSchema<any, any>> = {
	createGetFieldSchema,

	serializer: async ({
		dependencies,
		values,
		name,
		fieldSchema,
		getFieldSchema,
		getFieldType,
		parents,
	}) => {
		const { getSchema } = fieldSchema;

		const resultSchema = await getSchema({
			dependencies,
			values,
			phase: "serialize",
			getFieldSchema,
			getFieldType,
			parents,
		});

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

	parser: async ({
		dependencies,
		values,
		name,
		fieldSchema,
		getFieldSchema,
		getFieldType,
		parents,
	}) => {
		const { getSchema } = fieldSchema;

		const resultSchema = await getSchema({
			dependencies,
			values,
			phase: "parse",
			getFieldSchema,
			getFieldType,
			parents,
		});

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

	validatorBeforeSubmit: async ({
		dependencies,
		setError,
		values,
		name,
		fieldSchema,
		getFieldSchema,
		getFieldType,
		parents,
	}) => {
		const { getSchema } = fieldSchema as DynamicSchema<any, any>;

		const resultSchema = await getSchema({
			dependencies,
			values,
			phase: "serialize",
			getFieldSchema,
			getFieldType,
			parents,
		});

		if (!resultSchema) {
			return;
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

	errorsSetter: async ({
		dependencies,
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

		const resultSchema = await getSchema({
			dependencies,
			values: rawValues,
			phase: "serialize",
			getFieldSchema,
			getFieldType,
			parents,
		});

		if (!resultSchema) {
			return;
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
