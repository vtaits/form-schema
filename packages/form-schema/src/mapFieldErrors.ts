import type {
	ErrorsMapper,
	GetFieldSchema,
	GetFieldType,
	ParentType,
} from "./types";

export const defaultFieldErrorsMapper: ErrorsMapper<any, any, any, any, any> = (
	errors,
	name,
) => {
	if (typeof errors[name] !== "undefined") {
		return {
			[name]: errors[name],
		};
	}

	return {};
};

export const mapFieldErrors = <
	FieldSchema,
	Values extends Record<string, any>,
	RawValues extends Record<string, any>,
	SerializedValues extends Record<string, any>,
	Errors extends Record<string, any>,
>(
	errors: Errors,
	names: string[],
	getFieldSchema: GetFieldSchema<FieldSchema>,
	getFieldType: GetFieldType<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors
	>,
	values: SerializedValues,
	rawValues: Values,
	parents: ParentType<Values>[],
): Errors => {
	const res = {
		...errors,
	};

	for (const name of names) {
		const fieldSchema = getFieldSchema(name);
		const fieldType = getFieldType(fieldSchema);

		const errorsMapper = fieldType.errorsMapper || defaultFieldErrorsMapper;
		const computedGetFieldSchema = fieldType.createGetFieldSchema
			? fieldType.createGetFieldSchema(
					fieldSchema,
					getFieldSchema,
					getFieldType,
					rawValues,
					"serialize",
					parents,
			  )
			: getFieldSchema;

		Object.assign(
			res,
			errorsMapper(
				res,
				name,
				fieldSchema,
				computedGetFieldSchema,
				getFieldType,
				values,
				rawValues,
				parents,
			),
		);
	}

	return res;
};
