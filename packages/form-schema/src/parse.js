const defaultParser = (values, { name }) => {
  if (typeof values[name] !== 'undefined') {
    return {
      [name]: values[name],
    };
  }

  return {
    [name]: null,
  };
};

const parse = (values, schema, getFieldSchema, getFieldType) => {
  if (!values) {
    return null;
  }

  const res = {};

  schema.forEach((schemaItem) => {
    const fieldSchema = getFieldSchema(schemaItem);
    const fieldType = getFieldType(fieldSchema);

    const parser = fieldType.parser || defaultParser;
    const computedGetFieldSchema = fieldType.createGetFieldSchema
      ? fieldType.createGetFieldSchema(fieldSchema, getFieldSchema)
      : getFieldSchema;

    Object.assign(res, parser(
      values,
      fieldSchema,
      computedGetFieldSchema,
      getFieldType,
    ));
  });

  return res;
};

export default parse;
