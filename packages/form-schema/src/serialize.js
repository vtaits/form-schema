const defaultSerializer = (values, fieldUniq) => {
  if (typeof values[fieldUniq] !== 'undefined') {
    return {
      [fieldUniq]: values[fieldUniq],
    };
  }

  return {};
};

const serialize = (values, schema, getFieldSchema, getFieldType) => {
  const res = {};

  schema.forEach((fieldUniq) => {
    const fieldSchema = getFieldSchema(fieldUniq);
    const fieldType = getFieldType(fieldSchema);

    const serializer = fieldType.serializer || defaultSerializer;
    const computedGetFieldSchema = fieldType.createGetFieldSchema
      ? fieldType.createGetFieldSchema(fieldSchema, getFieldSchema)
      : getFieldSchema;

    Object.assign(res, serializer(
      values,
      fieldUniq,
      fieldSchema,
      computedGetFieldSchema,
      getFieldType,
    ));
  });

  return res;
};

export default serialize;
