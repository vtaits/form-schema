import type {
	BaseValues,
	GetFieldSchema,
	GetFieldType,
	NameType,
	ParentType,
	SetError,
} from "./types";

export type ValidateBeforeSubmitParams<
	FieldSchema,
	Values extends BaseValues,
	RawValues extends BaseValues,
	SerializedValues extends BaseValues,
	Errors extends Record<string, any>,
> = Readonly<{
	setError: SetError<Values>;
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

export const validateBeforeSubmit = <
	FieldSchema,
	Values extends BaseValues,
	RawValues extends BaseValues,
	SerializedValues extends BaseValues,
	Errors extends Record<string, any>,
>({
	setError,
	values,
	names,
	getFieldSchema,
	getFieldType,
	parents,
}: ValidateBeforeSubmitParams<
	FieldSchema,
	Values,
	RawValues,
	SerializedValues,
	Errors
>) => {
	for (const name of names) {
		const fieldSchema = getFieldSchema(name);
		const fieldType = getFieldType(fieldSchema);

		const validatorBeforeSubmit = fieldType.validatorBeforeSubmit;

		if (validatorBeforeSubmit) {
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

			validatorBeforeSubmit({
				setError,
				value: values[name as keyof Values],
				values,
				name,
				fieldSchema,
				getFieldSchema: computedGetFieldSchema,
				getFieldType,
				parents,
			});
		}
	}
};
