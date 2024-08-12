export type NameType = string | number;

export type BaseValues = Record<NameType, unknown> | readonly unknown[];

export type GetFieldSchema<FieldSchema> = (name: NameType) => FieldSchema;
export type GetFieldType<
	FieldSchema,
	Values extends BaseValues,
	RawValues extends BaseValues,
	SerializedValues extends BaseValues,
	Errors extends Record<string, unknown> = Record<string, unknown>,
> = (
	fieldSchema: FieldSchema,
) => FieldType<FieldSchema, Values, RawValues, SerializedValues, Errors>;

export type PhaseType = "parse" | "serialize" | "render";

export type SetError<Values extends BaseValues> = (
	name: NameType,
	parents: readonly ParentType[] | undefined,
	error: unknown,
) => void;

export type ParentType<Values extends BaseValues = BaseValues> = {
	/**
	 * Empty for the root node
	 */
	name?: NameType;
	values: Values;
};

export type CreateGetFieldSchemaParams<
	FieldSchema,
	Values extends BaseValues,
	RawValues extends BaseValues,
	SerializedValues extends BaseValues,
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
	parents: readonly ParentType[];
}>;

/**
 * function for create `getFieldSchema` for nested fields
 * can be helpful for arrays of repeating fields etc.
 */
export type CreateGetFieldSchema<
	FieldSchema,
	Values extends BaseValues,
	RawValues extends BaseValues,
	SerializedValues extends BaseValues,
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
	Values extends BaseValues,
	RawValues extends BaseValues,
	SerializedValues extends BaseValues,
	Errors extends Record<string, unknown> = Record<string, unknown>,
> = Readonly<{
	/**
	 * current runtime value by field name
	 */
	value: unknown;
	/**
	 * current runtime values
	 */
	values: Values;
	/**
	 * name of current field
	 */
	name: NameType;
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
	parents: readonly ParentType[];
}>;

export type Serializer<
	FieldSchema,
	Values extends BaseValues,
	RawValues extends BaseValues,
	SerializedValues extends BaseValues,
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
 * Single serializer of the field
 */
export type SerializerSingle<
	FieldSchema,
	Values extends BaseValues,
	RawValues extends BaseValues,
	SerializedValues extends BaseValues,
	Errors extends Record<string, unknown> = Record<string, unknown>,
> = (
	params: SerializerParams<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors
	>,
) => unknown;

/**
 * Parameters of parser of the field
 */
export type ParserParams<
	FieldSchema,
	Values extends BaseValues,
	RawValues extends BaseValues,
	SerializedValues extends BaseValues,
	Errors extends Record<string, unknown> = Record<string, unknown>,
> = Readonly<{
	/**
	 * current raw value by field name
	 */
	value: unknown;
	/**
	 * raw values
	 */
	values: RawValues;
	/**
	 * name of current field
	 */
	name: NameType;
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
	parents: readonly ParentType[];
}>;

export type Parser<
	FieldSchema,
	Values extends BaseValues,
	RawValues extends BaseValues,
	SerializedValues extends BaseValues,
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

/**
 * Single parser of the field
 */
export type ParserSingle<
	FieldSchema,
	Values extends BaseValues,
	RawValues extends BaseValues,
	SerializedValues extends BaseValues,
	Errors extends Record<string, unknown> = Record<string, unknown>,
> = (
	params: ParserParams<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors
	>,
) => unknown | Promise<unknown>;

export type ValidatorBeforeSubmitParams<
	FieldSchema,
	Values extends BaseValues,
	RawValues extends BaseValues,
	SerializedValues extends BaseValues,
	Errors extends Record<string, unknown> = Record<string, unknown>,
> = Readonly<{
	/**
	 * Function for setting errors
	 */
	setError: SetError<Values>;
	/**
	 * Function for setting error in the current field
	 */
	setCurrentError: (error: unknown) => void;
	/**
	 * current runtime value by field name
	 */
	value: unknown;
	/**
	 * current runtime values
	 */
	values: Values;
	/**
	 * name of current field
	 */
	name: NameType;
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
	parents: readonly ParentType[];
}>;

export type ValidatorBeforeSubmit<
	FieldSchema,
	Values extends BaseValues,
	RawValues extends BaseValues,
	SerializedValues extends BaseValues,
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
	Values extends BaseValues,
	RawValues extends BaseValues,
	SerializedValues extends BaseValues,
	Errors extends Record<NameType, unknown> = Record<NameType, unknown>,
> = Readonly<{
	/**
	 * Function for setting errors
	 */
	setError: SetError<Values>;
	/**
	 * Function for setting error in the current field
	 */
	setCurrentError: (error: unknown) => void;
	/**
	 * errors
	 */
	errors: Errors;
	/**
	 * name of current field
	 */
	name: NameType;
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
	 * current serialized value by field name
	 */
	value: unknown;
	/**
	 * serialized values
	 */
	values: SerializedValues;
	/**
	 * current runtime value by field name
	 */
	rawValue: unknown;
	/**
	 * current runtime values
	 */
	rawValues: Values;
	/**
	 * stack of parent fields above current field with runtime values
	 */
	parents: readonly ParentType[];
}>;

export type ErrorsSetter<
	FieldSchema,
	Values extends BaseValues,
	RawValues extends BaseValues,
	SerializedValues extends BaseValues,
	Errors extends Record<NameType, unknown> = Record<NameType, unknown>,
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
	Values extends BaseValues = BaseValues,
	RawValues extends BaseValues = BaseValues,
	SerializedValues extends BaseValues = BaseValues,
	Errors extends Record<NameType, unknown> = Record<NameType, unknown>,
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
	serializerSingle?: SerializerSingle<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors
	>;
	parser?: Parser<FieldSchema, Values, RawValues, SerializedValues, Errors>;
	parserSingle?: ParserSingle<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors
	>;
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
