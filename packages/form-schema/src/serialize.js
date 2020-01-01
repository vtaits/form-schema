const defaultSerializer = (values, { name }) => {
  if (typeof values[name] !== 'undefined') {
    return {
      [name]: values[name],
    };
  }

  return {};
};

const serialize = (values, schema, getFieldSchema, getFieldType) => {
  const res = {};

  schema.forEach((schemaItem) => {
    const fieldSchema = getFieldSchema(schemaItem);
    const fieldType = getFieldType(fieldSchema);

    const serializer = fieldType.serializer || defaultSerializer;
    const computedGetFieldSchema = fieldType.createGetFieldSchema
      ? fieldType.createGetFieldSchema(fieldSchema, getFieldSchema)
      : getFieldSchema;

    Object.assign(res, serializer(
      values,
      fieldSchema,
      computedGetFieldSchema,
      getFieldType,
    ));
  });

  return res;
};

export default serialize;
