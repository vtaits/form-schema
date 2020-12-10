/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  GetFieldSchema,
  GetFieldType,
  Serializer,
} from './types';

const defaultSerializer: Serializer<any, any, any, any, any> = (
  values,
  name,
) => {
  if (typeof values[name] !== 'undefined') {
    return {
      [name]: values[name],
    };
  }

  return {};
};

const serialize = <
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
  ): SerializedValues => {
  const res = {} as SerializedValues;

  names.forEach((name) => {
    const fieldSchema = getFieldSchema(name);
    const fieldType = getFieldType(fieldSchema);

    const serializer = fieldType.serializer || defaultSerializer;
    const computedGetFieldSchema = fieldType.createGetFieldSchema
      ? fieldType.createGetFieldSchema(
        fieldSchema,
        getFieldSchema,
        getFieldType,
        values,
        'serialize',
      )
      : getFieldSchema;

    Object.assign(res, serializer(
      values,
      name,
      fieldSchema,
      computedGetFieldSchema,
      getFieldType,
    ));
  });

  return res;
};

export default serialize;
