/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  defaultSerializer,
  defaultParser,
  defaultFieldErrorsMapper,
} from '@vtaits/form-schema';
import type {
  GetFieldSchema,
  GetFieldType,
  PhaseType,
} from '@vtaits/form-schema';

import type {
  FieldType,
} from '../../core';

import {
  DynamicField,
} from './component';

import type {
  DynamicSchema,
} from './schema';

export const createGetFieldSchema = <
FieldSchema,
Values extends Record<string, any>,
RawValues extends Record<string, any>,
SerializedValues extends Record<string, any>,
Errors extends Record<string, any>,
>(
    { getSchema }: DynamicSchema<FieldSchema, Values, RawValues, SerializedValues, Errors>,
    getFieldSchema: GetFieldSchema<FieldSchema>,
    getFieldType: GetFieldType<FieldSchema, Values, RawValues, SerializedValues, Errors>,
    values: Values | RawValues,
    phase: PhaseType,
  ): GetFieldSchema<FieldSchema> => {
  const schema = getSchema(values, phase, getFieldSchema, getFieldType);

  if (!schema) {
    return getFieldSchema;
  }

  const fieldType = getFieldType(schema);

  if (fieldType.createGetFieldSchema) {
    return fieldType.createGetFieldSchema(
      schema,
      getFieldSchema,
      getFieldType,
      values,
      phase,
    );
  }

  return getFieldSchema;
};

export const dynamic: FieldType<DynamicSchema<any>> = {
  component: DynamicField,

  createGetFieldSchema,

  serializer: (values, name, fieldSchema, getFieldSchema, getFieldType) => {
    const {
      getSchema,
    } = fieldSchema;

    const schema = getSchema(values, 'serialize', getFieldSchema, getFieldType);

    if (!schema) {
      return {};
    }

    const fieldType = getFieldType(schema);

    if (fieldType.serializer) {
      return fieldType.serializer(
        values,
        name,
        schema,
        getFieldSchema,
        getFieldType,
      );
    }

    return defaultSerializer(values, name, fieldSchema, getFieldSchema, getFieldType);
  },

  parser: (values, name, fieldSchema, getFieldSchema, getFieldType) => {
    const {
      getSchema,
      getSchemaAsync,
    } = fieldSchema;

    if (getSchemaAsync) {
      return getSchemaAsync(values, 'parse', getFieldSchema, getFieldType)
        .then((schema) => {
          if (!schema) {
            return {};
          }

          const fieldType = getFieldType(schema);

          if (fieldType.parser) {
            return fieldType.parser(
              values,
              name,
              schema,
              getFieldSchema,
              getFieldType,
            );
          }

          return defaultParser(values, name, fieldSchema, getFieldSchema, getFieldType);
        });
    }

    const schema = getSchema(values, 'parse', getFieldSchema, getFieldType);

    if (!schema) {
      return {};
    }

    const fieldType = getFieldType(schema);

    if (fieldType.parser) {
      return fieldType.parser(
        values,
        name,
        schema,
        getFieldSchema,
        getFieldType,
      );
    }

    return defaultParser(values, name, fieldSchema, getFieldSchema, getFieldType);
  },

  validatorBeforeSubmit: (values, name, fieldSchema, getFieldSchema, getFieldType) => {
    const {
      getSchema,
    } = fieldSchema as DynamicSchema<any>;

    const schema = getSchema(values, 'serialize', getFieldSchema, getFieldType);

    if (!schema) {
      return {};
    }

    const fieldType = getFieldType(schema);

    if (fieldType.validatorBeforeSubmit) {
      return fieldType.validatorBeforeSubmit(
        values,
        name,
        schema,
        getFieldSchema,
        getFieldType,
      );
    }

    return {};
  },

  errorsMapper: (
    errors,
    name,
    fieldSchema,
    getFieldSchema,
    getFieldType,
    values,
    rawValues,
  ) => {
    const {
      getSchema,
    } = fieldSchema;

    const schema = getSchema(rawValues, 'serialize', getFieldSchema, getFieldType);

    if (!schema) {
      return {};
    }

    const fieldType = getFieldType(schema);

    if (fieldType.errorsMapper) {
      return fieldType.errorsMapper(
        errors,
        name,
        schema,
        getFieldSchema,
        getFieldType,
        values,
        rawValues,
      );
    }

    return defaultFieldErrorsMapper(
      errors,
      name,
      fieldSchema,
      getFieldSchema,
      getFieldType,
      values,
      rawValues,
    );
  },
};
