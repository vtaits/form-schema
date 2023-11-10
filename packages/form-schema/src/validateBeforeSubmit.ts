import type {
	GetFieldSchema,
	GetFieldType,
	ParentType,
	ValidatorBeforeSubmit,
} from "./types";

const defaultValidator: ValidatorBeforeSubmit<any, any, any, any, any> =
	() => ({});

export const validateBeforeSubmit = <
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
): Errors => {
	const res = {} as Errors;

	for (const name of names) {
		const fieldSchema = getFieldSchema(name);
		const fieldType = getFieldType(fieldSchema);

		const validatorBeforeSubmit =
			fieldType.validatorBeforeSubmit || defaultValidator;
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
			validatorBeforeSubmit(
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
