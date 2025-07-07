import type {
	BaseValues,
	FieldSchemaBase,
	GetFieldSchema,
	GetFieldType,
	NameType,
	ParentType,
	Serializer,
	SerializerParams,
} from "./types";

export const defaultSerializer: Serializer<any, any, any, any, any> = ({
	values,
	name,
}) => {
	if (typeof values[name] !== "undefined") {
		return {
			[name]: values[name],
		};
	}

	return {};
};

export type SerializeParams<
	FieldSchema,
	Values extends BaseValues,
	RawValues extends BaseValues,
	SerializedValues extends BaseValues,
	Errors extends Record<string, any>,
> = Readonly<{
	values: Values;
	names: readonly NameType[];
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

export async function serialize<
	FieldSchema extends FieldSchemaBase,
	Values extends BaseValues,
	RawValues extends BaseValues,
	SerializedValues extends BaseValues,
	Errors extends Record<string, any>,
>({
	values,
	names,
	getFieldSchema,
	getFieldType,
	parents,
}: SerializeParams<
	FieldSchema,
	Values,
	RawValues,
	SerializedValues,
	Errors
>): Promise<SerializedValues> {
	const preserializedValues = await Promise.all(
		names.map(async (name) => {
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

			const params: SerializerParams<
				FieldSchema,
				Values,
				RawValues,
				SerializedValues,
				Errors
			> = {
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
				const singleResult = await serializerSingle(params);

				return {
					[name]: singleResult,
				} as SerializedValues[keyof SerializedValues];
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

			return serializer(params);
		}),
	);

	const res = {} as SerializedValues;

	for (const serializedValue of preserializedValues) {
		Object.assign(res, serializedValue);
	}
	return res;
}
