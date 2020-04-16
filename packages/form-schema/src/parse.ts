import type {
  GetFieldSchema,
  GetFieldType,
  Values,
  Parser,
  FieldType,
} from './types';

const defaultParser: Parser = (values, name) => {
  if (typeof values[name] !== 'undefined') {
    return {
      [name]: values[name],
    };
  }

  return {
    [name]: null,
  };
};

const parse = (
  values: Values | null,
  names: string[],
  getFieldSchema: GetFieldSchema,
  getFieldType: GetFieldType,
): Values => {
  if (!values) {
    return null;
  }

  const res = {};

  names.forEach((name: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fieldSchema: any = getFieldSchema(name);
    const fieldType: FieldType = getFieldType(fieldSchema);

    const parser: Parser = fieldType.parser || defaultParser;
    const computedGetFieldSchema: GetFieldSchema = fieldType.createGetFieldSchema
      ? fieldType.createGetFieldSchema(fieldSchema, getFieldSchema)
      : getFieldSchema;

    Object.assign(res, parser(
      values,
      name,
      fieldSchema,
      computedGetFieldSchema,
      getFieldType,
    ));
  });

  return res;
};

export default parse;
