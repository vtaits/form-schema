/* eslint-disable @typescript-eslint/no-explicit-any */

export type GetFieldSchema<FieldSchema> = (name: string) => FieldSchema;
export type GetFieldType<
FieldSchema,
Values extends Record<string, any> = Record<string, any>,
RawValues extends Record<string, any> = Record<string, any>,
SerializedValues extends Record<string, any> = Record<string, any>,
Errors extends Record<string, any> = Record<string, any>,
> = (fieldSchema: FieldSchema) => FieldType<
FieldSchema,
Values,
RawValues,
SerializedValues,
Errors
>;

export type PhaseType = 'parse' | 'serialize' | 'render';

export type CreateGetFieldSchema<
FieldSchema,
Values extends Record<string, any> = Record<string, any>,
RawValues extends Record<string, any> = Record<string, any>,
SerializedValues extends Record<string, any> = Record<string, any>,
Errors extends Record<string, any> = Record<string, any>,
> = (
  fieldSchema: FieldSchema,
  getFieldSchema: GetFieldSchema<FieldSchema>,
  getFieldType: GetFieldType<
  FieldSchema,
  Values,
  RawValues,
  SerializedValues,
  Errors
  >,
  values: Values | RawValues,
  phase: PhaseType,
) => GetFieldSchema<FieldSchema>;

export type Serializer<
FieldSchema,
Values extends Record<string, any> = Record<string, any>,
RawValues extends Record<string, any> = Record<string, any>,
SerializedValues extends Record<string, any> = Record<string, any>,
Errors extends Record<string, any> = Record<string, any>,
> = (
  values: Values,
  name: string,
  fieldSchema: FieldSchema,
  computedGetFieldSchema: GetFieldSchema<FieldSchema>,
  getFieldType: GetFieldType<
  FieldSchema,
  Values,
  RawValues,
  SerializedValues,
  Errors
  >,
) => SerializedValues;

export type Parser<
FieldSchema,
Values extends Record<string, any> = Record<string, any>,
RawValues extends Record<string, any> = Record<string, any>,
SerializedValues extends Record<string, any> = Record<string, any>,
Errors extends Record<string, any> = Record<string, any>,
> = (
  values: RawValues,
  name: string,
  fieldSchema: FieldSchema,
  computedGetFieldSchema: GetFieldSchema<FieldSchema>,
  getFieldType: GetFieldType<
  FieldSchema,
  Values,
  RawValues,
  SerializedValues,
  Errors
  >,
) => Values;

export type ValidatorBeforeSubmit<
FieldSchema,
Values extends Record<string, any> = Record<string, any>,
RawValues extends Record<string, any> = Record<string, any>,
SerializedValues extends Record<string, any> = Record<string, any>,
Errors extends Record<string, any> = Record<string, any>,
> = (
  values: Values,
  name: string,
  fieldSchema: FieldSchema,
  computedGetFieldSchema: GetFieldSchema<FieldSchema>,
  getFieldType: GetFieldType<
  FieldSchema,
  Values,
  RawValues,
  SerializedValues,
  Errors
  >,
) => Errors;

export type ErrorsMapper<
FieldSchema,
Values extends Record<string, any> = Record<string, any>,
RawValues extends Record<string, any> = Record<string, any>,
SerializedValues extends Record<string, any> = Record<string, any>,
Errors extends Record<string, any> = Record<string, any>,
> = (
  res: Errors,
  name: string,
  fieldSchema: FieldSchema,
  computedGetFieldSchema: GetFieldSchema<FieldSchema>,
  getFieldType: GetFieldType<
  FieldSchema,
  Values,
  RawValues,
  SerializedValues,
  Errors
  >,
  values: SerializedValues,
  rawValues: Values,
) => Errors;

export type FieldType<
FieldSchema,
Values extends Record<string, any> = Record<string, any>,
RawValues extends Record<string, any> = Record<string, any>,
SerializedValues extends Record<string, any> = Record<string, any>,
Errors extends Record<string, any> = Record<string, any>,
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
