const defaultFieldErrorsMapper = (errors, name) => {
  if (typeof errors[name] !== 'undefined') {
    return {
      [name]: errors[name],
    };
  }

  return {};
};

const mapFieldErrors = (errors, names, getFieldSchema, getFieldType, values, rawValues) => {
  const res = {
    ...errors,
  };

  names.forEach((name) => {
    const fieldSchema = getFieldSchema(name);
    const fieldType = getFieldType(fieldSchema);

    const errorsMapper = fieldType.errorsMapper || defaultFieldErrorsMapper;
    const computedGetFieldSchema = fieldType.createGetFieldSchema
      ? fieldType.createGetFieldSchema(fieldSchema, getFieldSchema)
      : getFieldSchema;

    Object.assign(
      res,
      errorsMapper(
        res,
        name,
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
