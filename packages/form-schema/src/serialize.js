const defaultSerializer = (values, name) => {
  if (typeof values[name] !== 'undefined') {
    return {
      [name]: values[name],
    };
  }

  return {};
};

const serialize = (values, names, getFieldSchema, getFieldType) => {
  const res = {};

  names.forEach((name) => {
    const fieldSchema = getFieldSchema(name);
    const fieldType = getFieldType(fieldSchema);

    const serializer = fieldType.serializer || defaultSerializer;
    const computedGetFieldSchema = fieldType.createGetFieldSchema
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
