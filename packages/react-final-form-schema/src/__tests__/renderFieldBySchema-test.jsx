import React from 'react';
import { shallow } from 'enzyme';

import renderFieldBySchema from '../renderFieldBySchema';

test('should render field', () => {
  const FieldComponent = () => <div />;

  const fieldType = {
    component: FieldComponent,
  };

  const fieldSchema = Symbol('field schema');

  const getFieldSchema = jest.fn(() => fieldSchema);
  const getFieldType = jest.fn(() => fieldType);

  const renderedField = renderFieldBySchema(getFieldSchema, getFieldType, 'testField', 'testPayload');

  const fieldWrapper = shallow(
    <div>
      {renderedField}
    </div>,
  );

  const fieldNode = fieldWrapper.find(FieldComponent);

  expect(fieldNode.prop('fieldUniq')).toBe('testField');
  expect(fieldNode.prop('fieldSchema')).toBe(fieldSchema);
  expect(fieldNode.prop('payload')).toBe('testPayload');
  expect(fieldNode.prop('getFieldSchema')).toBe(getFieldSchema);
  expect(fieldNode.prop('getFieldType')).toBe(getFieldType);

  expect(getFieldSchema.mock.calls.length).toBe(1);
  expect(getFieldSchema.mock.calls[0][0]).toBe('testField');

  expect(getFieldType.mock.calls.length).toBe(1);
  expect(getFieldType.mock.calls[0][0]).toBe(fieldSchema);
});

test('should render field with redefined getFieldSchema for children', () => {
  const WrapperComponent = () => <div />;
  const ChildComponent = () => <div />;

  const wrapperSchema = {
    type: 'wrapper',
  };

  const childSchema = {
    type: 'child',
  };

  const nextGetFieldSchema = jest.fn(() => childSchema);

  const createGetFieldSchema = jest.fn(() => nextGetFieldSchema);

  const fieldTypes = {
    wrapper: {
      createGetFieldSchema,
      component: WrapperComponent,
    },

    child: {
      component: ChildComponent,
    },
  };

  const getFieldSchema = jest.fn(() => wrapperSchema);
  const getFieldType = jest.fn(({ type }) => fieldTypes[type]);

  const renderedField = renderFieldBySchema(getFieldSchema, getFieldType, 'wrapperField', 'testPayload1');

  const fieldWrapper = shallow(
    <div>
      {renderedField}
    </div>,
  );

  const wrapperNode = fieldWrapper.find(WrapperComponent);

  expect(wrapperNode.prop('fieldUniq')).toBe('wrapperField');
  expect(wrapperNode.prop('fieldSchema')).toBe(wrapperSchema);
  expect(wrapperNode.prop('payload')).toBe('testPayload1');
  expect(wrapperNode.prop('getFieldSchema')).toBe(nextGetFieldSchema);
  expect(wrapperNode.prop('getFieldType')).toBe(getFieldType);

  expect(createGetFieldSchema.mock.calls.length).toBe(1);
  expect(createGetFieldSchema.mock.calls[0][0]).toBe(wrapperSchema);
  expect(createGetFieldSchema.mock.calls[0][1]).toBe(getFieldSchema);

  expect(getFieldSchema.mock.calls.length).toBe(1);
  expect(getFieldSchema.mock.calls[0][0]).toBe('wrapperField');

  expect(getFieldType.mock.calls.length).toBe(1);
  expect(getFieldType.mock.calls[0][0]).toBe(wrapperSchema);

  const renderField = wrapperNode.prop('renderField');

  const renderedChild = renderField('childField', 'testPayload2');

  const childWrapper = shallow(
    <div>
      {renderedChild}
    </div>,
  );

  const childNode = childWrapper.find(ChildComponent);

  expect(childNode.prop('fieldUniq')).toBe('childField');
  expect(childNode.prop('fieldSchema')).toBe(childSchema);
  expect(childNode.prop('payload')).toBe('testPayload2');
  expect(childNode.prop('getFieldSchema')).toBe(nextGetFieldSchema);
  expect(childNode.prop('getFieldType')).toBe(getFieldType);

  expect(nextGetFieldSchema.mock.calls.length).toBe(1);
  expect(nextGetFieldSchema.mock.calls[0][0]).toBe('childField');

  expect(getFieldType.mock.calls.length).toBe(2);
  expect(getFieldType.mock.calls[1][0]).toBe(childSchema);
});
