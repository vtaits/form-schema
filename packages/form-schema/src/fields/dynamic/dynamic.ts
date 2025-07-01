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
	const { getDependencies, getSchema } = fieldSchema as DynamicSchema<
		FormApi,
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors
	>;

	const dependencies = getDependencies({
		values,
		phase,
		getFieldSchema,
		getFieldType,
		parents,
	});

	const resultSchema = getSchema({
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

	serializer: ({
		values,
		name,
		fieldSchema,
		getFieldSchema,
		getFieldType,
		parents,
	}) => {
		const { getSchema, getDependencies } = fieldSchema;

		const dependencies = getDependencies({
			values,
			phase: "serialize",
			getFieldSchema,
			getFieldType,
			parents,
		});

		const resultSchema = getSchema({
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

	parser: ({
		values,
		name,
		fieldSchema,
		getFieldSchema,
		getFieldType,
		parents,
	}) => {
		const { getDependencies, getSchema, getSchemaAsync } = fieldSchema;

		const dependencies = getDependencies({
			values,
			phase: "parse",
			getFieldSchema,
			getFieldType,
			parents,
		});

		if (getSchemaAsync) {
			return getSchemaAsync({
				dependencies,
				values,
				phase: "parse",
				getFieldSchema,
				getFieldType,
				parents,
			}).then((resultSchema) => {
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

		const resultSchema = getSchema({
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

	validatorBeforeSubmit: ({
		setError,
		values,
		name,
		fieldSchema,
		getFieldSchema,
		getFieldType,
		parents,
	}) => {
		const { getDependencies, getSchema } = fieldSchema as DynamicSchema<
			any,
			any
		>;

		const dependencies = getDependencies({
			values,
			phase: "serialize",
			getFieldSchema,
			getFieldType,
			parents,
		});

		const resultSchema = getSchema({
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
		const { getDependencies, getSchema } = fieldSchema;

		const dependencies = getDependencies({
			values: rawValues,
			phase: "serialize",
			getFieldSchema,
			getFieldType,
			parents,
		});

		const resultSchema = getSchema({
			dependencies,
			values: rawValues,
			phase: "serialize",
			getFieldSchema,
			getFieldType,
			parents,
		});

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
