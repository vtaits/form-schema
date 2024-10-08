import { defaultSerializer } from "./serialize";
import type {
	BaseValues,
	FieldSchemaBase,
	GetFieldSchema,
	GetFieldType,
	NameType,
	ParentType,
} from "./types";

export type SerializeSingleParams<
	FieldSchema,
	Values extends BaseValues,
	RawValues extends BaseValues,
	SerializedValues extends BaseValues,
	Errors extends Record<string, any>,
> = Readonly<{
	values: Values;
	name: NameType;
	getFieldSchema: GetFieldSchema<FieldSchema>;
	getFieldType: GetFieldType<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors
	>;
	parents: readonly ParentType[];
}>;

export function serializeSingle<
	FieldSchema extends FieldSchemaBase,
	Values extends BaseValues,
	RawValues extends BaseValues,
	SerializedValues extends BaseValues,
	Errors extends Record<string, any>,
>({
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
		value: values[name as keyof Values],
		values,
		name,
		fieldSchema,
		getFieldSchema: computedGetFieldSchema,
		getFieldType,
		parents,
	};

	const serializerSingle =
		(fieldSchema.serializerSingle as typeof fieldType.serializerSingle) ||
		fieldType.serializerSingle;

	if (serializerSingle) {
		return serializerSingle(params);
	}

	const serializer =
		(fieldSchema.serializer as typeof fieldType.serializer) ||
		fieldType.serializer ||
		defaultSerializer;

	const serialized = serializer(params);

	return serialized[name];
}
