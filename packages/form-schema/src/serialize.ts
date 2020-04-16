import type {
  GetFieldSchema,
  GetFieldType,
  Values,
  Serializer,
  FieldType,
} from './types';

const defaultSerializer: Serializer = (values, name) => {
  if (typeof values[name] !== 'undefined') {
    return {
      [name]: values[name],
    };
  }

  return {};
};

const serialize = (
  values: Values,
  names: string[],
  getFieldSchema: GetFieldSchema,
  getFieldType: GetFieldType,
): Values => {
  const res = {};

  names.forEach((name: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fieldSchema: any = getFieldSchema(name);
    const fieldType: FieldType = getFieldType(fieldSchema);

    const serializer: Serializer = fieldType.serializer || defaultSerializer;
    const computedGetFieldSchema: GetFieldSchema = fieldType.createGetFieldSchema
      ? fieldType.createGetFieldSchema(fieldSchema, getFieldSchema)
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
