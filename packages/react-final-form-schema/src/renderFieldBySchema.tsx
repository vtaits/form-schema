import React from 'react';

import type {
  GetFieldSchema,
} from '@vtaits/form-schema';

import type {
  GetFieldType,
  FieldType,
  RenderField,
  RenderFieldBySchema,
} from './types';

const renderFieldBySchema: RenderFieldBySchema = (
  getFieldSchema: GetFieldSchema,
  getFieldType: GetFieldType,
  name: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any,
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fieldSchema: any = getFieldSchema(name);
  const fieldType: FieldType = getFieldType(fieldSchema);

  const {
    createGetFieldSchema,
    component: FieldComponent,
  } = fieldType;

  const computedGetFieldSchema: GetFieldSchema = createGetFieldSchema
    ? createGetFieldSchema(fieldSchema, getFieldSchema)
    : getFieldSchema;

  const renderField: RenderField = (
    childName: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    childPayload?: any,
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
};

export default renderFieldBySchema;
