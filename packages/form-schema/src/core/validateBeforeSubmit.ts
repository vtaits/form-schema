import type {
	GetFieldSchema,
	GetFieldType,
	ParentType,
	SetError,
} from "./types";

export const validateBeforeSubmit = <
	FieldSchema,
	Values extends Record<string, any>,
	RawValues extends Record<string, any>,
	SerializedValues extends Record<string, any>,
	Errors extends Record<string, any>,
>(
	setError: SetError<Values>,
	values: Values,
	names: readonly string[],
	getFieldSchema: GetFieldSchema<FieldSchema>,
	getFieldType: GetFieldType<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors
	>,
	parents: ParentType<Values>[],
) => {
	for (const name of names) {
		const fieldSchema = getFieldSchema(name);
		const fieldType = getFieldType(fieldSchema);

		const validatorBeforeSubmit = fieldType.validatorBeforeSubmit;

		if (validatorBeforeSubmit) {
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

			validatorBeforeSubmit(
				setError,
				values,
				name,
				fieldSchema,
				computedGetFieldSchema,
				getFieldType,
				parents,
			);
		}
	}
};
