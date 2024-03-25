import type {
	ErrorsSetter,
	GetFieldSchema,
	GetFieldType,
	ParentType,
	SetError,
} from "./types";

export const defaultFieldErrorsSetter: ErrorsSetter<any, any, any, any, any> =
	({ setError, errors, name, parents }) => {
		if (typeof errors[name] !== "undefined") {
			setError(name, parents, errors[name]);
		}
	};

export type SetFieldErrorsParams<
	FieldSchema,
	Values extends Record<string, any>,
	RawValues extends Record<string, any>,
	SerializedValues extends Record<string, any>,
	Errors extends Record<string, any>,
> = Readonly<{
	setError: SetError<Values>;
	errors: Errors;
	names: readonly string[];
	getFieldSchema: GetFieldSchema<FieldSchema>;
	getFieldType: GetFieldType<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors
	>;
	values: SerializedValues;
	rawValues: Values;
	parents: readonly ParentType<Values>[];
}>;

export const setFieldErrors = <
	FieldSchema,
	Values extends Record<string, any>,
	RawValues extends Record<string, any>,
	SerializedValues extends Record<string, any>,
	Errors extends Record<string, any>,
>({
	setError,
	errors,
	names,
	getFieldSchema,
	getFieldType,
	values,
	rawValues,
	parents,
}: SetFieldErrorsParams<
	FieldSchema,
	Values,
	RawValues,
	SerializedValues,
	Errors
>): void => {
	for (const name of names) {
		const fieldSchema = getFieldSchema(name);
		const fieldType = getFieldType(fieldSchema);

		const errorsSetter = fieldType.errorsSetter || defaultFieldErrorsSetter;
		const computedGetFieldSchema = fieldType.createGetFieldSchema
			? fieldType.createGetFieldSchema({
					fieldSchema,
					getFieldSchema,
					getFieldType,
					values: rawValues,
					phase: "serialize",
					parents,
				})
			: getFieldSchema;

		errorsSetter({
			setError,
			errors,
			name,
			fieldSchema,
			getFieldSchema: computedGetFieldSchema,
			getFieldType,
			values,
			rawValues,
			parents,
		});
	}
};
