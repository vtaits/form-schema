import React from 'react';

const renderFieldBySchema = (getFieldSchema, getFieldType, name, payload) => {
  const fieldSchema = getFieldSchema(name);
  const fieldType = getFieldType(fieldSchema);

  const {
    createGetFieldSchema,
    component: FieldComponent,
  } = fieldType;

  const computedGetFieldSchema = createGetFieldSchema
    ? createGetFieldSchema(fieldSchema, getFieldSchema)
    : getFieldSchema;

  const renderField = (childName, childPayload) => renderFieldBySchema(
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
