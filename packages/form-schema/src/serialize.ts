import type {
	GetFieldSchema,
	GetFieldType,
	ParentType,
	Serializer,
} from "./types";

export const defaultSerializer: Serializer<any, any, any, any, any> = (
	values,
	name,
) => {
	if (typeof values[name] !== "undefined") {
		return {
			[name]: values[name],
		};
	}

	return {};
};

export const serialize = <
	FieldSchema,
	Values extends Record<string, any>,
	RawValues extends Record<string, any>,
	SerializedValues extends Record<string, any>,
	Errors extends Record<string, any>,
>(
	values: Values,
	names: string[],
	getFieldSchema: GetFieldSchema<FieldSchema>,
	getFieldType: GetFieldType<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors
	>,
	parents: ParentType<Values>[],
): SerializedValues => {
	const res = {} as SerializedValues;

	for (const name of names) {
		const fieldSchema = getFieldSchema(name);
		const fieldType = getFieldType(fieldSchema);

		const serializer = fieldType.serializer || defaultSerializer;
		const computedGetFieldSchema = fieldType.createGetFieldSchema
			? fieldType.createGetFieldSchema(
					fieldSchema,
					getFieldSchema,
					getFieldType,
					values,
					"serialize",
					parents,
			  )
			: getFieldSchema;

		Object.assign(
			res,
			serializer(
				values,
				name,
				fieldSchema,
				computedGetFieldSchema,
				getFieldType,
				parents,
			),
		);
	}

	return res;
};
