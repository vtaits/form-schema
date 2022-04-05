/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  ReactNode,
} from 'react';
import type {
  GetFieldSchema,
  ParentType,
} from '@vtaits/form-schema';

import type {
  GetFieldType,
  FieldType,
  RenderField,
} from './types';

export function renderFieldBySchema<
FieldSchema,
Values extends Record<string, any>,
RawValues extends Record<string, any>,
SerializedValues extends Record<string, any>,
Errors extends Record<string, any>,
Payload,
>(
  getFieldSchema: GetFieldSchema<FieldSchema>,
  getFieldType: GetFieldType<
  FieldSchema,
  Values,
  RawValues,
  SerializedValues,
  Errors,
  Payload
  >,
  name: string,
  payload: Payload | undefined,
  parents: ParentType<Values>[],
): ReactNode {
  const {
    values,
  } = parents[parents.length - 1];

  const fieldSchema = getFieldSchema(name);
  const fieldType: FieldType<
  FieldSchema,
  Values,
  RawValues,
  SerializedValues,
  Errors,
  Payload
  > = getFieldType(fieldSchema);

  const {
    createGetFieldSchema,
    component: FieldComponent,
  } = fieldType;

  const computedGetFieldSchema: GetFieldSchema<FieldSchema> = createGetFieldSchema
    ? createGetFieldSchema(
      fieldSchema,
      getFieldSchema,
      getFieldType,
      values,
      'render',
      parents,
    )
    : getFieldSchema;

  const renderField: RenderField<Values, Payload> = (
    childName,
    childPayload,
    nextParents,
  ) => renderFieldBySchema(
    computedGetFieldSchema,
    getFieldType,
    childName,
    childPayload,
    nextParents || parents,
  );

  return (
    <FieldComponent
      name={name}
      fieldSchema={fieldSchema}
      payload={payload}
      getFieldSchema={computedGetFieldSchema}
      getFieldType={getFieldType}
      renderField={renderField}
      parents={parents}
    />
  );
}
