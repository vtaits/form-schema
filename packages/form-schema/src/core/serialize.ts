import type {
	BaseValues,
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

export function serialize<
	FieldSchema,
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
		};

		if (fieldType.serializerSingle) {
			res[name as keyof SerializedValues] = fieldType.serializerSingle(
				params,
			) as SerializedValues[keyof SerializedValues];
		} else {
			const serializer =
				fieldType.serializer ||
				(defaultSerializer as Serializer<
					FieldSchema,
					Values,
					RawValues,
					SerializedValues,
					Errors
				>);

			Object.assign(res, serializer(params));
		}
	}

	return res;
}
