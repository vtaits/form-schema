/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  GetFieldSchema,
  GetFieldType,
  ErrorsMapper,
} from './types';

const defaultFieldErrorsMapper: ErrorsMapper<any, any, any, any, any> = (
  errors,
  name,
) => {
  if (typeof errors[name] !== 'undefined') {
    return {
      [name]: errors[name],
    };
  }

  return {};
};

const mapFieldErrors = <
FieldSchema,
Values extends Record<string, any>,
RawValues extends Record<string, any>,
SerializedValues extends Record<string, any>,
Errors extends Record<string, any>,
>(
    errors: Errors,
    names: string[],
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
  ): Errors => {
  const res = {
    ...errors,
  };

  names.forEach((name) => {
    const fieldSchema = getFieldSchema(name);
    const fieldType = getFieldType(fieldSchema);

    const errorsMapper = fieldType.errorsMapper || defaultFieldErrorsMapper;
    const computedGetFieldSchema = fieldType.createGetFieldSchema
      ? fieldType.createGetFieldSchema(fieldSchema, getFieldSchema, rawValues, 'serialize')
      : getFieldSchema;

    Object.assign(
      res,
      errorsMapper(
        res,
        name,
        fieldSchema,
        computedGetFieldSchema,
        getFieldType,
        values,
        rawValues,
      ),
    );
  });

  return res;
};

export default mapFieldErrors;
