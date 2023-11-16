import {
	type CreateGetFieldSchemaParams,
	type FieldType,
	type GetFieldSchema,
	type GetFieldType,
	type ParentType,
	type PhaseType,
	defaultFieldErrorsSetter,
	defaultParser,
	defaultSerializer,
} from "../../core";
import type { DynamicSchema } from "./schema";

export const createGetFieldSchema = <
	FormApi,
	FieldSchema,
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
>): GetFieldSchema<FieldSchema> => {
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

	const fieldType = getFieldType(resultSchema);

	if (fieldType.createGetFieldSchema) {
		return fieldType.createGetFieldSchema({
			fieldSchema: resultSchema,
			getFieldSchema,
			getFieldType,
			values,
			phase,
			parents,
		});
	}

	return getFieldSchema;
};

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

		const fieldType = getFieldType(resultSchema);

		if (fieldType.serializer) {
			return fieldType.serializer({
				values,
				name,
				fieldSchema: resultSchema,
				getFieldSchema,
				getFieldType,
				parents,
			});
		}

		return defaultSerializer({
			values,
			name,
			fieldSchema: resultSchema,
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

				const fieldType = getFieldType(resultSchema);

				if (fieldType.parser) {
					return fieldType.parser({
						values,
						name,
						fieldSchema: resultSchema,
						getFieldSchema,
						getFieldType,
						parents,
					});
				}

				return defaultParser({
					values,
					name,
					fieldSchema: resultSchema,
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

		const fieldType = getFieldType(resultSchema);

		if (fieldType.parser) {
			return fieldType.parser({
				values,
				name,
				fieldSchema: resultSchema,
				getFieldSchema,
				getFieldType,
				parents,
			});
		}

		return defaultParser({
			values,
			name,
			fieldSchema: resultSchema,
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

		const fieldType = getFieldType(resultSchema);

		if (fieldType.validatorBeforeSubmit) {
			return fieldType.validatorBeforeSubmit({
				setError,
				values,
				name,
				fieldSchema: resultSchema,
				getFieldSchema,
				getFieldType,
				parents,
			});
		}

		return {};
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

		const fieldType = getFieldType(resultSchema);

		if (fieldType.errorsSetter) {
			return fieldType.errorsSetter({
				setError,
				errors,
				name,
				fieldSchema: resultSchema,
				getFieldSchema,
				getFieldType,
				values,
				rawValues,
				parents,
			});
		}

		return defaultFieldErrorsSetter({
			setError,
			errors,
			name,
			fieldSchema: resultSchema,
			getFieldSchema,
			getFieldType,
			values,
			rawValues,
			parents,
		});
	},
};
