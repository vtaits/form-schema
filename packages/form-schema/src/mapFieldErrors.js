const defaultFieldErrorsMapper = (errors, fieldUniq) => {
  if (typeof errors[fieldUniq] !== 'undefined') {
    return {
      [fieldUniq]: errors[fieldUniq],
    };
  }

  return {};
};

const mapFieldErrors = (errors, schema, getFieldSchema, getFieldType, values, rawValues) => {
  const res = {
    ...errors,
  };

  schema.forEach((fieldUniq) => {
    const fieldSchema = getFieldSchema(fieldUniq);
    const fieldType = getFieldType(fieldSchema);

    const errorsMapper = fieldType.errorsMapper || defaultFieldErrorsMapper;
    const computedGetFieldSchema = fieldType.createGetFieldSchema
      ? fieldType.createGetFieldSchema(fieldSchema, getFieldSchema)
      : getFieldSchema;

    Object.assign(
      res,
      errorsMapper(
        res,
        fieldUniq,
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
