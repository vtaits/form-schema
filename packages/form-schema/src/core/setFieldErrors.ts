import type {
	ErrorsSetter,
	GetFieldSchema,
	GetFieldType,
	ParentType,
	SetError,
} from "./types";

export const defaultFieldErrorsSetter: ErrorsSetter<any, any, any, any, any> = (
	setError,
	errors,
	name,
	fieldSchema,
	computedGetFieldSchema,
	getFieldType,
	values,
	rawValues,
	parents,
) => {
	if (typeof errors[name] !== "undefined") {
		setError(name, parents, errors[name]);
	}
};

export const setFieldErrors = <
	FieldSchema,
	Values extends Record<string, any>,
	RawValues extends Record<string, any>,
	SerializedValues extends Record<string, any>,
	Errors extends Record<string, any>,
>(
	setError: SetError<Values>,
	errors: Errors,
	names: readonly string[],
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
): void => {
	for (const name of names) {
		const fieldSchema = getFieldSchema(name);
		const fieldType = getFieldType(fieldSchema);

		const errorsSetter = fieldType.errorsSetter || defaultFieldErrorsSetter;
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

		errorsSetter(
			setError,
			errors,
			name,
			fieldSchema,
			computedGetFieldSchema,
			getFieldType,
			values,
			rawValues,
			parents,
		);
	}
};
