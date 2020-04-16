/* eslint-disable @typescript-eslint/no-explicit-any */

export type GetFieldSchema = (name: string) => any;
export type GetFieldType = (fieldSchema: any) => FieldType;

export type Values = Record<string, any>;
export type Errors = Record<string, any>;

export type CreateGetFieldSchema = (
  fieldSchema: any,
  getFieldSchema: GetFieldSchema,
) => GetFieldSchema;

export type Serializer = (
  values: Values,
  name: string,
  fieldSchema: any,
  computedGetFieldSchema: GetFieldSchema,
  getFieldType: GetFieldType,
) => Values;

export type Parser = (
  values: Values,
  name: string,
  fieldSchema: any,
  computedGetFieldSchema: GetFieldSchema,
  getFieldType: GetFieldType,
) => Values;

export type ErrorsMapper = (
  res: Errors,
  name: string,
  fieldSchema: any,
  computedGetFieldSchema: GetFieldSchema,
  getFieldType: GetFieldType,
  values: Values,
  rawValues: Values,
) => Errors;

export type FieldType = {
  createGetFieldSchema?: CreateGetFieldSchema;
  serializer?: Serializer;
  parser?: Parser;
  errorsMapper?: ErrorsMapper;
};
