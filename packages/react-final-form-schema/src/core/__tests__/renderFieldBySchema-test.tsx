/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  shallow,
} from 'enzyme';
import type {
  ShallowWrapper,
} from 'enzyme';
import type {
  FC,
} from 'react';

import type {
  CreateGetFieldSchema,
} from '@vtaits/form-schema';

import { renderFieldBySchema } from '../renderFieldBySchema';

import {
  FieldComponentProps,
} from '../types';

test('should render field', () => {
  const FieldComponent: FC<FieldComponentProps<
  any,
  any,
  any,
  any,
  any,
  any
  >> = () => <div />;

  const fieldType = {
    component: FieldComponent,
  };

  const fieldSchema = Symbol('field schema');

  const getFieldSchema = jest.fn<any, [
    string,
  ]>(() => fieldSchema);
  const getFieldType = jest.fn<any, [any]>(() => fieldType);

  const renderedField = renderFieldBySchema(
    {},
    getFieldSchema,
    getFieldType,
    'testField',
    'testPayload',
  );

  const fieldWrapper = shallow(
    <div>
      {renderedField}
    </div>,
  );

  const fieldNode = fieldWrapper.find(FieldComponent);

  expect(fieldNode.prop('name')).toBe('testField');
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
  const WrapperComponent: FC<FieldComponentProps<
  any,
  any,
  any,
  any,
  any,
  any
  >> = () => <div />;
  const ChildComponent: FC<FieldComponentProps<
  any,
  any,
  any,
  any,
  any,
  any
  >> = () => <div />;

  const wrapperSchema = {
    type: 'wrapper',
  };

  const childSchema = {
    type: 'child',
  };

  const nextGetFieldSchema = jest.fn<any, [
    string,
  ]>()
    .mockReturnValue(childSchema);

  const createGetFieldSchema = jest.fn<
  any,
  Parameters<CreateGetFieldSchema<any, any, any, any, any>>
  >()
    .mockReturnValue(nextGetFieldSchema);

  const fieldTypes = {
    wrapper: {
      createGetFieldSchema,
      component: WrapperComponent,
    },

    child: {
      component: ChildComponent,
    },
  };

  const getFieldSchema = jest.fn<any, [
    string,
  ]>()
    .mockReturnValue(wrapperSchema);
  const getFieldType = jest.fn(({ type }) => fieldTypes[type]);

  const renderedField = renderFieldBySchema(
    {
      fieldName: 'value',
    },
    getFieldSchema,
    getFieldType,
    'wrapperField',
    'testPayload1',
  );

  const fieldWrapper = shallow(
    <div>
      {renderedField}
    </div>,
  );

  const wrapperNode = fieldWrapper.find(WrapperComponent);

  expect(wrapperNode.prop('name')).toBe('wrapperField');
  expect(wrapperNode.prop('fieldSchema')).toBe(wrapperSchema);
  expect(wrapperNode.prop('payload')).toBe('testPayload1');
  expect(wrapperNode.prop('getFieldSchema')).toBe(nextGetFieldSchema);
  expect(wrapperNode.prop('getFieldType')).toBe(getFieldType);

  expect(createGetFieldSchema).toHaveBeenCalledTimes(1);
  expect(createGetFieldSchema).toHaveBeenCalledWith(
    wrapperSchema,
    getFieldSchema,
    getFieldType,
    {
      fieldName: 'value',
    },
    'render',
  );

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

  const childNode: ShallowWrapper = childWrapper.find(ChildComponent);

  expect(childNode.prop('name')).toBe('childField');
  expect(childNode.prop('fieldSchema')).toBe(childSchema);
  expect(childNode.prop('payload')).toBe('testPayload2');
  expect(childNode.prop('getFieldSchema')).toBe(nextGetFieldSchema);
  expect(childNode.prop('getFieldType')).toBe(getFieldType);

  expect(nextGetFieldSchema.mock.calls.length).toBe(1);
  expect(nextGetFieldSchema.mock.calls[0][0]).toBe('childField');

  expect(getFieldType.mock.calls.length).toBe(2);
  expect(getFieldType.mock.calls[1][0]).toBe(childSchema);
});
