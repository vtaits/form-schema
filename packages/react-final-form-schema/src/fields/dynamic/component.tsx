/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  useFormState as defaultUseFormState,
} from 'react-final-form';
import type { ReactElement } from 'react';

import type {
  FieldComponentProps,
} from '../../core';

import type {
  DynamicSchema,
} from './schema';

export type DynamicFieldProps<
FieldSchema,
Values extends Record<string, any>,
RawValues extends Record<string, any>,
SerializedValues extends Record<string, any>,
Errors extends Record<string, any>,
Payload,
> =
  & FieldComponentProps<
  FieldSchema,
  Values,
  RawValues,
  SerializedValues,
  Errors,
  Payload
  >
  & {
    /**
     * For tests only
     */
    useFormState?: typeof defaultUseFormState;
  };

export function DynamicField<
FieldSchema,
Values extends Record<string, any>,
RawValues extends Record<string, any>,
SerializedValues extends Record<string, any>,
Errors extends Record<string, any>,
Payload,
>({
  fieldSchema,

  getFieldSchema,
  getFieldType,

  useFormState = defaultUseFormState,

  ...rest
}: DynamicFieldProps<
FieldSchema,
Values,
RawValues,
SerializedValues,
Errors,
Payload
>): ReactElement {
  const {
    values,
  } = useFormState<Values, Values>();

  const {
    getSchema,
  } = fieldSchema as unknown as DynamicSchema<
  FieldSchema,
  Values,
  RawValues,
  SerializedValues,
  Errors
  >;

  const schema = getSchema(values, 'render', getFieldSchema, getFieldType);

  if (!schema) {
    return null;
  }

  const fieldType = getFieldType(schema);

  const {
    component: FieldComponent,
  } = fieldType;

  return (
    <FieldComponent
      {...rest}
      fieldSchema={schema}
      getFieldSchema={getFieldSchema}
      getFieldType={getFieldType}
    />
  );
}
