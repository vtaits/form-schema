import React from 'react';

const renderFieldBySchema = (getFieldSchema, getFieldType, fieldUniq, payload) => {
  const fieldSchema = getFieldSchema(fieldUniq);
  const fieldType = getFieldType(fieldSchema);

  const {
    createGetFieldSchema,
    component: FieldComponent,
  } = fieldType;

  const computedGetFieldSchema = createGetFieldSchema
    ? createGetFieldSchema(fieldSchema, getFieldSchema)
    : getFieldSchema;

  const renderField = (childUniq, childPayload) => renderFieldBySchema(
    computedGetFieldSchema,
    getFieldType,
    childUniq,
    childPayload,
  );

  return (
    <FieldComponent
      fieldUniq={fieldUniq}
      fieldSchema={fieldSchema}
      payload={payload}
      getFieldSchema={computedGetFieldSchema}
      getFieldType={getFieldType}
      renderField={renderField}
    />
  );
};

export default renderFieldBySchema;
