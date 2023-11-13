import {
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
>(
	{
		getSchema,
	}: DynamicSchema<
		FormApi,
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors
	>,
	getFieldSchema: GetFieldSchema<FieldSchema>,
	getFieldType: GetFieldType<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors
	>,
	values: Values | RawValues,
	phase: PhaseType,
	parents: readonly ParentType<Values>[],
): GetFieldSchema<FieldSchema> => {
	const schema = getSchema(
		values,
		phase,
		getFieldSchema,
		getFieldType,
		parents,
	);

	if (!schema) {
		return getFieldSchema;
	}

	const fieldType = getFieldType(schema);

	if (fieldType.createGetFieldSchema) {
		return fieldType.createGetFieldSchema(
			schema,
			getFieldSchema,
			getFieldType,
			values,
			phase,
			parents,
		);
	}

	return getFieldSchema;
};

export const dynamic: FieldType<DynamicSchema<any, any>> = {
	createGetFieldSchema,

	serializer: (
		values,
		name,
		fieldSchema,
		getFieldSchema,
		getFieldType,
		parents,
	) => {
		const { getSchema } = fieldSchema;

		const schema = getSchema(
			values,
			"serialize",
			getFieldSchema,
			getFieldType,
			parents,
		);

		if (!schema) {
			return {};
		}

		const fieldType = getFieldType(schema);

		if (fieldType.serializer) {
			return fieldType.serializer(
				values,
				name,
				schema,
				getFieldSchema,
				getFieldType,
				parents,
			);
		}

		return defaultSerializer(
			values,
			name,
			fieldSchema,
			getFieldSchema,
			getFieldType,
			parents,
		);
	},

	parser: (
		values,
		name,
		fieldSchema,
		getFieldSchema,
		getFieldType,
		parents,
	) => {
		const { getSchema, getSchemaAsync } = fieldSchema;

		if (getSchemaAsync) {
			return getSchemaAsync(
				values,
				"parse",
				getFieldSchema,
				getFieldType,
				parents,
			).then((schema) => {
				if (!schema) {
					return {};
				}

				const fieldType = getFieldType(schema);

				if (fieldType.parser) {
					return fieldType.parser(
						values,
						name,
						schema,
						getFieldSchema,
						getFieldType,
						parents,
					);
				}

				return defaultParser(
					values,
					name,
					fieldSchema,
					getFieldSchema,
					getFieldType,
					parents,
				);
			});
		}

		const schema = getSchema(
			values,
			"parse",
			getFieldSchema,
			getFieldType,
			parents,
		);

		if (!schema) {
			return {};
		}

		const fieldType = getFieldType(schema);

		if (fieldType.parser) {
			return fieldType.parser(
				values,
				name,
				schema,
				getFieldSchema,
				getFieldType,
				parents,
			);
		}

		return defaultParser(
			values,
			name,
			fieldSchema,
			getFieldSchema,
			getFieldType,
			parents,
		);
	},

	validatorBeforeSubmit: (
		setError,
		values,
		name,
		fieldSchema,
		getFieldSchema,
		getFieldType,
		parents,
	) => {
		const { getSchema } = fieldSchema as DynamicSchema<any, any>;

		const schema = getSchema(
			values,
			"serialize",
			getFieldSchema,
			getFieldType,
			parents,
		);

		if (!schema) {
			return {};
		}

		const fieldType = getFieldType(schema);

		if (fieldType.validatorBeforeSubmit) {
			return fieldType.validatorBeforeSubmit(
				setError,
				values,
				name,
				schema,
				getFieldSchema,
				getFieldType,
				parents,
			);
		}

		return {};
	},

	errorsSetter: (
		setError,
		errors,
		name,
		fieldSchema,
		getFieldSchema,
		getFieldType,
		values,
		rawValues,
		parents,
	) => {
		const { getSchema } = fieldSchema;

		const schema = getSchema(
			rawValues,
			"serialize",
			getFieldSchema,
			getFieldType,
			parents,
		);

		if (!schema) {
			return {};
		}

		const fieldType = getFieldType(schema);

		if (fieldType.errorsSetter) {
			return fieldType.errorsSetter(
				setError,
				errors,
				name,
				schema,
				getFieldSchema,
				getFieldType,
				values,
				rawValues,
				parents,
			);
		}

		return defaultFieldErrorsSetter(
			setError,
			errors,
			name,
			fieldSchema,
			getFieldSchema,
			getFieldType,
			values,
			rawValues,
			parents,
		);
	},
};
