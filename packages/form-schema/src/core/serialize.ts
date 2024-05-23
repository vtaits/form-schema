import type {
	GetFieldSchema,
	GetFieldType,
	ParentType,
	Serializer,
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
	Values extends Record<string, any>,
	RawValues extends Record<string, any>,
	SerializedValues extends Record<string, any>,
	Errors extends Record<string, any>,
> = Readonly<{
	values: Values;
	names: readonly string[];
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

export function serialize<
	FieldSchema,
	Values extends Record<string, any>,
	RawValues extends Record<string, any>,
	SerializedValues extends Record<string, any>,
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
>): SerializedValues {
	const res = {} as SerializedValues;

	for (const name of names) {
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

		if (fieldType.serializerSingle) {
			res[name] = fieldType.serializerSingle({
				value: values[name],
				values,
				name,
				fieldSchema,
				getFieldSchema: computedGetFieldSchema,
				getFieldType,
				parents,
			})
		} else {
			const serializer = fieldType.serializer || defaultSerializer;
	
			Object.assign(
				res,
				serializer({
					values,
					name,
					fieldSchema,
					getFieldSchema: computedGetFieldSchema,
					getFieldType,
					parents,
				}),
			);
		}
	}

	return res;
};
