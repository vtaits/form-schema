import type {
  GetFieldSchema,
  GetFieldType,
  Errors,
  Values,
  ErrorsMapper,
  FieldType,
} from './types';

const defaultFieldErrorsMapper: ErrorsMapper = (
  errors: Errors,
  name: string,
) => {
  if (typeof errors[name] !== 'undefined') {
    return {
      [name]: errors[name],
    };
  }

  return {};
};

const mapFieldErrors = (
  errors: Errors,
  names: string[],
  getFieldSchema: GetFieldSchema,
  getFieldType: GetFieldType,
  values: Values,
  rawValues: Values,
): Errors => {
  const res = {
    ...errors,
  };

  names.forEach((name: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fieldSchema: any = getFieldSchema(name);
    const fieldType: FieldType = getFieldType(fieldSchema);

    const errorsMapper: ErrorsMapper = fieldType.errorsMapper || defaultFieldErrorsMapper;
    const computedGetFieldSchema: GetFieldSchema = fieldType.createGetFieldSchema
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
