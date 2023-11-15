export type GetFieldSchema<FieldSchema> = (name: string) => FieldSchema;
export type GetFieldType<
	FieldSchema,
	Values extends Record<string, unknown> = Record<string, unknown>,
	RawValues extends Record<string, unknown> = Record<string, unknown>,
	SerializedValues extends Record<string, unknown> = Record<string, unknown>,
	Errors extends Record<string, unknown> = Record<string, unknown>,
> = (
	fieldSchema: FieldSchema,
) => FieldType<FieldSchema, Values, RawValues, SerializedValues, Errors>;

export type PhaseType = "parse" | "serialize" | "render";

export type SetError<Values extends Record<string, unknown>> = (
	name: string,
	parents: readonly ParentType<Values>[] | undefined,
	error: unknown,
) => void;

export type ParentType<
	Values extends Record<string, unknown> = Record<string, unknown>,
> = {
	/**
	 * Empty for the root node
	 */
	name?: string | number;
	values: Values;
};

export type CreateGetFieldSchemaParams<
	FieldSchema,
	Values extends Record<string, unknown> = Record<string, unknown>,
	RawValues extends Record<string, unknown> = Record<string, unknown>,
	SerializedValues extends Record<string, unknown> = Record<string, unknown>,
	Errors extends Record<string, unknown> = Record<string, unknown>,
> = Readonly<{
	/**
	 * schema of current field
	 */
	fieldSchema: FieldSchema;
	/**
	 * current `getFieldSchema`
	 */
	getFieldSchema: GetFieldSchema<FieldSchema>;
	/**
	 * global `getFieldType`
	 */
	getFieldType: GetFieldType<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors
	>;
	/**
	 * current values (values of form during render and serialization or raw values during parsing)
	 */
	values: Values | RawValues;
	/**
	 * one of next values: 'parse', 'serialize', 'render'
	 */
	phase: PhaseType;
	/**
	 * stack of parent fields above current field
	 * raw values for phase 'parse' and runtime values otherwise
	 */
	parents: readonly ParentType<Values | RawValues>[];
}>;

/**
 * function for create `getFieldSchema` for nested fields
 * can be helpful for arrays of repeating fields etc.
 */
export type CreateGetFieldSchema<
	FieldSchema,
	Values extends Record<string, unknown> = Record<string, unknown>,
	RawValues extends Record<string, unknown> = Record<string, unknown>,
	SerializedValues extends Record<string, unknown> = Record<string, unknown>,
	Errors extends Record<string, unknown> = Record<string, unknown>,
> = (
	params: CreateGetFieldSchemaParams<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors
	>,
) => GetFieldSchema<FieldSchema>;

/**
 * Parameters of serializer of the field
 */
export type SerializerParams<
	FieldSchema,
	Values extends Record<string, unknown> = Record<string, unknown>,
	RawValues extends Record<string, unknown> = Record<string, unknown>,
	SerializedValues extends Record<string, unknown> = Record<string, unknown>,
	Errors extends Record<string, unknown> = Record<string, unknown>,
> = Readonly<{
	/**
	 * current runtime values
	 */
	values: Values;
	/**
	 * name of current field
	 */
	name: string;
	/**
	 * schema of current field
	 */
	fieldSchema: FieldSchema;
	/**
	 * current `getFieldSchema`
	 */
	getFieldSchema: GetFieldSchema<FieldSchema>;
	/**
	 * global `getFieldType`
	 */
	getFieldType: GetFieldType<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors
	>;
	/**
	 * stack of parent fields above current field with runtime values
	 */
	parents: readonly ParentType<Values>[];
}>;

export type Serializer<
	FieldSchema,
	Values extends Record<string, unknown> = Record<string, unknown>,
	RawValues extends Record<string, unknown> = Record<string, unknown>,
	SerializedValues extends Record<string, unknown> = Record<string, unknown>,
	Errors extends Record<string, unknown> = Record<string, unknown>,
> = (
	params: SerializerParams<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors
	>,
) => SerializedValues;

/**
 * Parameters of parser of the field
 */
export type ParserParams<
	FieldSchema,
	Values extends Record<string, unknown> = Record<string, unknown>,
	RawValues extends Record<string, unknown> = Record<string, unknown>,
	SerializedValues extends Record<string, unknown> = Record<string, unknown>,
	Errors extends Record<string, unknown> = Record<string, unknown>,
> = Readonly<{
	/**
	 * raw values
	 */
	values: RawValues;
	/**
	 * name of current field
	 */
	name: string;
	/**
	 * schema of current field
	 */
	fieldSchema: FieldSchema;
	/**
	 * current `getFieldSchema`
	 */
	getFieldSchema: GetFieldSchema<FieldSchema>;
	/**
	 * global `getFieldType`
	 */
	getFieldType: GetFieldType<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors
	>;
	/**
	 * stack of parent fields above current field with raw values
	 */
	parents: readonly ParentType<RawValues>[];
}>;

export type Parser<
	FieldSchema,
	Values extends Record<string, unknown> = Record<string, unknown>,
	RawValues extends Record<string, unknown> = Record<string, unknown>,
	SerializedValues extends Record<string, unknown> = Record<string, unknown>,
	Errors extends Record<string, unknown> = Record<string, unknown>,
> = (
	params: ParserParams<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors
	>,
) => Values | Promise<Values>;

export type ValidatorBeforeSubmitParams<
	FieldSchema,
	Values extends Record<string, unknown> = Record<string, unknown>,
	RawValues extends Record<string, unknown> = Record<string, unknown>,
	SerializedValues extends Record<string, unknown> = Record<string, unknown>,
	Errors extends Record<string, unknown> = Record<string, unknown>,
> = Readonly<{
	/**
	 * Function for setting errors
	 */
	setError: SetError<Values>;
	/**
	 * current runtime values
	 */
	values: Values;
	/**
	 * name of current field
	 */
	name: string;
	/**
	 * schema of current field
	 */
	fieldSchema: FieldSchema;
	/**
	 * current `getFieldSchema`
	 */
	getFieldSchema: GetFieldSchema<FieldSchema>;
	/**
	 * global `getFieldType`
	 */
	getFieldType: GetFieldType<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors
	>;
	/**
	 * stack of parent fields above current field with runtime values
	 */
	parents: readonly ParentType<Values>[];
}>;

export type ValidatorBeforeSubmit<
	FieldSchema,
	Values extends Record<string, unknown> = Record<string, unknown>,
	RawValues extends Record<string, unknown> = Record<string, unknown>,
	SerializedValues extends Record<string, unknown> = Record<string, unknown>,
	Errors extends Record<string, unknown> = Record<string, unknown>,
> = (
	params: ValidatorBeforeSubmitParams<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors
	>,
) => void;

export type ErrorsSetterParams<
	FieldSchema,
	Values extends Record<string, unknown> = Record<string, unknown>,
	RawValues extends Record<string, unknown> = Record<string, unknown>,
	SerializedValues extends Record<string, unknown> = Record<string, unknown>,
	Errors extends Record<string, unknown> = Record<string, unknown>,
> = Readonly<{
	/**
	 * Function for setting errors
	 */
	setError: SetError<Values>;
	/**
	 * errors
	 */
	errors: Errors;
	/**
	 * name of current field
	 */
	name: string;
	/**
	 * schema of current field
	 */
	fieldSchema: FieldSchema;
	/**
	 * current `getFieldSchema`
	 */
	getFieldSchema: GetFieldSchema<FieldSchema>;
	/**
	 * global `getFieldType`
	 */
	getFieldType: GetFieldType<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors
	>;
	/**
	 * serialized values
	 */
	values: SerializedValues;
	/**
	 * current runtime values
	 */
	rawValues: Values;
	/**
	 * stack of parent fields above current field with runtime values
	 */
	parents: readonly ParentType<Values>[];
}>;

export type ErrorsSetter<
	FieldSchema,
	Values extends Record<string, unknown> = Record<string, unknown>,
	RawValues extends Record<string, unknown> = Record<string, unknown>,
	SerializedValues extends Record<string, unknown> = Record<string, unknown>,
	Errors extends Record<string, unknown> = Record<string, unknown>,
> = (
	params: ErrorsSetterParams<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors
	>,
) => void;

export type FieldType<
	FieldSchema,
	Values extends Record<string, unknown> = Record<string, unknown>,
	RawValues extends Record<string, unknown> = Record<string, unknown>,
	SerializedValues extends Record<string, unknown> = Record<string, unknown>,
	Errors extends Record<string, unknown> = Record<string, unknown>,
> = {
	createGetFieldSchema?: CreateGetFieldSchema<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors
	>;
	serializer?: Serializer<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors
	>;
	parser?: Parser<FieldSchema, Values, RawValues, SerializedValues, Errors>;
	validatorBeforeSubmit?: ValidatorBeforeSubmit<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors
	>;
	errorsSetter?: ErrorsSetter<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors
	>;
};
