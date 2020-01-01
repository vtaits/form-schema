const defaultFieldErrorsMapper = (errors, { name }) => {
  if (typeof errors[name] !== 'undefined') {
    return {
      [name]: errors[name],
    };
  }

  return {};
};

const mapFieldErrors = (errors, schema, getFieldSchema, getFieldType, values, rawValues) => {
  const res = {
    ...errors,
  };

  schema.forEach((schemaItem) => {
    const fieldSchema = getFieldSchema(schemaItem);
    const fieldType = getFieldType(fieldSchema);

    const errorsMapper = fieldType.errorsMapper || defaultFieldErrorsMapper;
    const computedGetFieldSchema = fieldType.createGetFieldSchema
      ? fieldType.createGetFieldSchema(fieldSchema, getFieldSchema)
      : getFieldSchema;

    Object.assign(
      res,
      errorsMapper(
        res,
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
