import { defaultSerializer } from "./serialize";
import type {
	BaseValues,
	FieldSchemaBase,
	GetFieldSchema,
	GetFieldType,
	NameType,
	ParentType,
	Serializer,
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

export async function serializeSingle<
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
>): Promise<unknown> {
	const fieldSchema = getFieldSchema(name);
	const fieldType = getFieldType(fieldSchema);

	const dependencies = fieldSchema.getDependencies?.({
		values,
		phase: "serialize",
		getFieldSchema,
		getFieldType: getFieldType as unknown as GetFieldType<
			FieldSchemaBase,
			BaseValues,
			BaseValues,
			BaseValues,
			Record<string, any>
		>,
		parents,
	});

	const computedGetFieldSchema = fieldType.createGetFieldSchema
		? await fieldType.createGetFieldSchema({
				fieldSchema,
				getFieldSchema,
				getFieldType,
				values,
				phase: "serialize",
				parents,
				dependencies,
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
		dependencies,
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
		(defaultSerializer as Serializer<
			FieldSchema,
			Values,
			RawValues,
			SerializedValues,
			Errors
		>);

	const serialized = await serializer(params);

	return serialized[name as keyof SerializedValues];
}
