/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  ReactNode,
} from 'react';
import type {
  GetFieldSchema,
} from '@vtaits/form-schema';

import type {
  GetFieldType,
  FieldType,
  RenderField,
} from './types';

function renderFieldBySchema<
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
  payload?: Payload,
): ReactNode {
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
    ? createGetFieldSchema(fieldSchema, getFieldSchema)
    : getFieldSchema;

  const renderField: RenderField<Payload> = (
    childName,
    childPayload,
  ) => renderFieldBySchema(
    computedGetFieldSchema,
    getFieldType,
    childName,
    childPayload,
  );

  return (
    <FieldComponent
      name={name}
      fieldSchema={fieldSchema}
      payload={payload}
      getFieldSchema={computedGetFieldSchema}
      getFieldType={getFieldType}
      renderField={renderField}
    />
  );
}

export default renderFieldBySchema;
