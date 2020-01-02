const defaultParser = (values, fieldUniq) => {
  if (typeof values[fieldUniq] !== 'undefined') {
    return {
      [fieldUniq]: values[fieldUniq],
    };
  }

  return {
    [fieldUniq]: null,
  };
};

const parse = (values, schema, getFieldSchema, getFieldType) => {
  if (!values) {
    return null;
  }

  const res = {};

  schema.forEach((fieldUniq) => {
    const fieldSchema = getFieldSchema(fieldUniq);
    const fieldType = getFieldType(fieldSchema);

    const parser = fieldType.parser || defaultParser;
    const computedGetFieldSchema = fieldType.createGetFieldSchema
      ? fieldType.createGetFieldSchema(fieldSchema, getFieldSchema)
      : getFieldSchema;

    Object.assign(res, parser(
      values,
      fieldUniq,
      fieldSchema,
      computedGetFieldSchema,
      getFieldType,
    ));
  });

  return res;
};

export default parse;
