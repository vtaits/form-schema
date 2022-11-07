export type GetFieldSchema<FieldSchema> = (name: string) => FieldSchema;
export type GetFieldType<
FieldSchema,
Values extends Record<string, unknown> = Record<string, unknown>,
RawValues extends Record<string, unknown> = Record<string, unknown>,
SerializedValues extends Record<string, unknown> = Record<string, unknown>,
Errors extends Record<string, unknown> = Record<string, unknown>,
> = (fieldSchema: FieldSchema) => FieldType<
FieldSchema,
Values,
RawValues,
SerializedValues,
Errors
>;

export type PhaseType = 'parse' | 'serialize' | 'render';

export type ParentType<Values extends Record<string, unknown> = Record<string, unknown>> = {
  /**
   * Empty for the root node
   */
  name?: string | number;
  values: Values;
};

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
  /**
   * schema of current field
   */
  fieldSchema: FieldSchema,
  /**
   * current `getFieldSchema`
   */
  getFieldSchema: GetFieldSchema<FieldSchema>,
  /**
   * global `getFieldType`
   */
  getFieldType: GetFieldType<
  FieldSchema,
  Values,
  RawValues,
  SerializedValues,
  Errors
  >,
  /**
   * current values (values of form during render and serialization or raw values during parsing)
   */
  values: Values | RawValues,
  /**
   * one of next values: 'parse', 'serialize', 'render'
   */
  phase: PhaseType,
  /**
   * stack of parent fields above current field
   * raw values for phase 'parse' and runtime values otherwise
   */
  parents: ParentType<Values | RawValues>[],
) => GetFieldSchema<FieldSchema>;

export type Serializer<
FieldSchema,
Values extends Record<string, unknown> = Record<string, unknown>,
RawValues extends Record<string, unknown> = Record<string, unknown>,
SerializedValues extends Record<string, unknown> = Record<string, unknown>,
Errors extends Record<string, unknown> = Record<string, unknown>,
> = (
  /**
   * current runtime values
   */
  values: Values,
  /**
   * name of current field
   */
  name: string,
  /**
   * schema of current field
   */
  fieldSchema: FieldSchema,
  /**
   * current `getFieldSchema`
   */
  computedGetFieldSchema: GetFieldSchema<FieldSchema>,
  /**
   * global `getFieldType`
   */
  getFieldType: GetFieldType<
  FieldSchema,
  Values,
  RawValues,
  SerializedValues,
  Errors
  >,
  /**
   * stack of parent fields above current field with runtime values
   */
  parents: ParentType<Values>[],
) => SerializedValues;

export type Parser<
FieldSchema,
Values extends Record<string, unknown> = Record<string, unknown>,
RawValues extends Record<string, unknown> = Record<string, unknown>,
SerializedValues extends Record<string, unknown> = Record<string, unknown>,
Errors extends Record<string, unknown> = Record<string, unknown>,
> = (
  /**
   * raw values
   */
  values: RawValues,
  /**
   * name of current field
   */
  name: string,
  /**
   * schema of current field
   */
  fieldSchema: FieldSchema,
  /**
   * current `getFieldSchema`
   */
  computedGetFieldSchema: GetFieldSchema<FieldSchema>,
  /**
   * global `getFieldType`
   */
  getFieldType: GetFieldType<
  FieldSchema,
  Values,
  RawValues,
  SerializedValues,
  Errors
  >,
  /**
   * stack of parent fields above current field with raw values
   */
  parents: ParentType<RawValues>[],
) => Values | Promise<Values>;

export type ValidatorBeforeSubmit<
FieldSchema,
Values extends Record<string, unknown> = Record<string, unknown>,
RawValues extends Record<string, unknown> = Record<string, unknown>,
SerializedValues extends Record<string, unknown> = Record<string, unknown>,
Errors extends Record<string, unknown> = Record<string, unknown>,
> = (
  /**
   * current runtime values
   */
  values: Values,
  /**
   * name of current field
   */
  name: string,
  /**
   * schema of current field
   */
  fieldSchema: FieldSchema,
  /**
   * current `getFieldSchema`
   */
  computedGetFieldSchema: GetFieldSchema<FieldSchema>,
  /**
   * global `getFieldType`
   */
  getFieldType: GetFieldType<
  FieldSchema,
  Values,
  RawValues,
  SerializedValues,
  Errors
  >,
  /**
   * stack of parent fields above current field with runtime values
   */
  parents: ParentType<Values>[],
) => Errors;

export type ErrorsMapper<
FieldSchema,
Values extends Record<string, unknown> = Record<string, unknown>,
RawValues extends Record<string, unknown> = Record<string, unknown>,
SerializedValues extends Record<string, unknown> = Record<string, unknown>,
Errors extends Record<string, unknown> = Record<string, unknown>,
> = (
  /**
   * collected errors
   */
  res: Errors,
  /**
   * name of current field
   */
  name: string,
  /**
   * schema of current field
   */
  fieldSchema: FieldSchema,
  /**
   * current `getFieldSchema`
   */
  computedGetFieldSchema: GetFieldSchema<FieldSchema>,
  /**
   * global `getFieldType`
   */
  getFieldType: GetFieldType<
  FieldSchema,
  Values,
  RawValues,
  SerializedValues,
  Errors
  >,
  /**
   * serialized values
   */
  values: SerializedValues,
  /**
   * current runtime values
   */
  rawValues: Values,
  /**
   * stack of parent fields above current field with runtime values
   */
  parents: ParentType<Values>[],
) => Errors;

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
  parser?: Parser<
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
  errorsMapper?: ErrorsMapper<
  FieldSchema,
  Values,
  RawValues,
  SerializedValues,
  Errors
  >;
};
