import { defaultSerializer } from "./serialize";
import type { GetFieldSchema, GetFieldType, ParentType } from "./types";

export type SerializeSingleParams<
	FieldSchema,
	Values extends Record<string, any>,
	RawValues extends Record<string, any>,
	SerializedValues extends Record<string, any>,
	Errors extends Record<string, any>,
> = Readonly<{
	value: unknown;
	values: Values;
	name: string;
	getFieldSchema: GetFieldSchema<FieldSchema>;
	getFieldType: GetFieldType<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors
	>;
	parents: readonly ParentType<Values>[];
}>;

export function serializeSingle<
	FieldSchema,
	Values extends Record<string, any>,
	RawValues extends Record<string, any>,
	SerializedValues extends Record<string, any>,
	Errors extends Record<string, any>,
>({
	value,
	values,
	name,
	getFieldSchema,
	getFieldType,
	parents,
}: SerializeSingleParams<
	FieldSchema,
	Values,
	RawValues,
	SerializedValues,
	Errors
>): unknown {
	const fieldSchema = getFieldSchema(name);
	const fieldType = getFieldType(fieldSchema);

	const computedGetFieldSchema = fieldType.createGetFieldSchema
		? fieldType.createGetFieldSchema({
				fieldSchema,
				getFieldSchema,
				getFieldType,
				values,
				phase: "serialize",
				parents,
			})
		: getFieldSchema;

	const params = {
		value: values[name],
		values,
		name,
		fieldSchema,
		getFieldSchema: computedGetFieldSchema,
		getFieldType,
		parents,
	};

	if (fieldType.serializerSingle) {
		return fieldType.serializerSingle(params);
	}

	const serializer = fieldType.serializer || defaultSerializer;

	const serialized = serializer(params);

	return serialized[name];
}
