import type {
	BaseValues,
	ErrorsSetter,
	FieldSchemaBase,
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

export async function setFieldErrors<
	FieldSchema extends FieldSchemaBase,
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
>): Promise<void> {
	await Promise.all(
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

			const errorsSetter =
				(fieldSchema.errorsSetter as typeof fieldType.errorsSetter) ||
				fieldType.errorsSetter ||
				(defaultFieldErrorsSetter as ErrorsSetter<
					FieldSchema,
					Values,
					RawValues,
					SerializedValues,
					Errors
				>);

			const computedGetFieldSchema = fieldType.createGetFieldSchema
				? await fieldType.createGetFieldSchema({
						fieldSchema,
						getFieldSchema,
						getFieldType,
						values: rawValues,
						phase: "serialize",
						parents,
						dependencies,
					})
				: getFieldSchema;

			await errorsSetter({
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
				dependencies,
			});
		}),
	);
}
