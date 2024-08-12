import type {
	BaseValues,
	ErrorsSetter,
	GetFieldSchema,
	GetFieldType,
	NameType,
	ParentType,
	SetError,
} from "./types";

export const defaultFieldErrorsSetter: ErrorsSetter<
	any,
	any,
	any,
	any,
	any
> = ({ setError, errors, name, parents }) => {
	if (typeof errors[name] !== "undefined") {
		setError(name, parents, errors[name]);
	}
};

export type SetFieldErrorsParams<
	FieldSchema,
	Values extends BaseValues,
	RawValues extends BaseValues,
	SerializedValues extends BaseValues,
	Errors extends Record<string, any>,
> = Readonly<{
	setError: SetError<Values>;
	errors: Errors;
	names: readonly NameType[];
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
	parents: readonly ParentType[];
}>;

export const setFieldErrors = <
	FieldSchema,
	Values extends BaseValues,
	RawValues extends BaseValues,
	SerializedValues extends BaseValues,
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

		const errorsSetter =
			fieldType.errorsSetter ||
			(defaultFieldErrorsSetter as ErrorsSetter<
				FieldSchema,
				Values,
				RawValues,
				SerializedValues,
				Errors
			>);
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
			setCurrentError: (error) => {
				setError(name, parents, error);
			},
			errors,
			name,
			fieldSchema,
			getFieldSchema: computedGetFieldSchema,
			getFieldType,
			value: values[name as keyof SerializedValues],
			values,
			rawValue: rawValues[name as keyof Values],
			rawValues,
			parents,
		});
	}
};
