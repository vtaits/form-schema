/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  GetFieldSchema,
  GetFieldType,
  ValidatorBeforeSubmit,
} from './types';

const defaultValidator: ValidatorBeforeSubmit<any, any, any, any, any> = () => ({
});

export const validateBeforeSubmit = <
FieldSchema,
Values extends Record<string, any>,
RawValues extends Record<string, any>,
SerializedValues extends Record<string, any>,
Errors extends Record<string, any>,
>(
    values: Values,
    names: string[],
    getFieldSchema: GetFieldSchema<FieldSchema>,
    getFieldType: GetFieldType<
    FieldSchema,
    Values,
    RawValues,
    SerializedValues,
    Errors
    >,
  ): Errors => {
  const res = {} as Errors;

  names.forEach((name) => {
    const fieldSchema = getFieldSchema(name);
    const fieldType = getFieldType(fieldSchema);

    const validatorBeforeSubmit = fieldType.validatorBeforeSubmit || defaultValidator;
    const computedGetFieldSchema = fieldType.createGetFieldSchema
      ? fieldType.createGetFieldSchema(
        fieldSchema,
        getFieldSchema,
        getFieldType,
        values,
        'serialize',
      )
      : getFieldSchema;

    Object.assign(res, validatorBeforeSubmit(
      values,
      name,
      fieldSchema,
      computedGetFieldSchema,
      getFieldType,
    ));
  });

  return res;
};