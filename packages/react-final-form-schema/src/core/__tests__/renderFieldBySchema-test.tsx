/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  FC,
  ReactElement,
} from 'react';

import type {
  CreateGetFieldSchema,
  ParentType,
} from '@vtaits/form-schema';

import { renderFieldBySchema } from '../renderFieldBySchema';

import {
  FieldComponentProps,
} from '../types';

test('should render field', () => {
  function FieldComponent(): ReactElement {
    return <div />;
  }

  const fieldType = {
    component: FieldComponent as FC<FieldComponentProps<
    any,
    any,
    any,
    any,
    any,
    any
    >>,
  };

  const fieldSchema = Symbol('field schema');

  const getFieldSchema = jest.fn<any, [string]>()
    .mockReturnValue(fieldSchema);
  const getFieldType = jest.fn()
    .mockReturnValue(fieldType);

  const parents: ParentType[] = [
    {
      values: {},
    },
  ];

  const fieldNode = renderFieldBySchema(
    getFieldSchema,
    getFieldType,
    'testField',
    'testPayload',
    parents,
  ) as ReactElement<FieldComponentProps<
  any,
  any,
  any,
  any,
  any,
  any
  >, FC>;

  const {
    props: fieldProps,
  } = fieldNode;

  expect(fieldProps.name).toBe('testField');
  expect(fieldProps.fieldSchema).toBe(fieldSchema);
  expect(fieldProps.payload).toBe('testPayload');
  expect(fieldProps.getFieldSchema).toBe(getFieldSchema);
  expect(fieldProps.getFieldType).toBe(getFieldType);
  expect(fieldProps.parents).toBe(parents);

  expect(getFieldSchema).toHaveBeenCalledTimes(1);
  expect(getFieldSchema).toHaveBeenCalledWith('testField');

  expect(getFieldType).toHaveBeenCalledTimes(1);
  expect(getFieldType).toHaveBeenCalledWith(fieldSchema);
});

test('should render field with redefined getFieldSchema for children', () => {
  function WrapperComponent(): ReactElement {
    return <div />;
  }

  function ChildComponent(): ReactElement {
    return <div />;
  }

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
      component: WrapperComponent as FC<FieldComponentProps<
      any,
      any,
      any,
      any,
      any,
      any
      >>,
    },

    child: {
      component: ChildComponent as FC<FieldComponentProps<
      any,
      any,
      any,
      any,
      any,
      any
      >>,
    },
  };

  const getFieldSchema = jest.fn<any, [
    string,
  ]>()
    .mockReturnValue(wrapperSchema);
  const getFieldType = jest.fn(({ type }) => fieldTypes[type]);

  const parents: ParentType[] = [
    {
      values: {
        fieldName: 'value',
      },
    },
  ];

  const wrapperNode = renderFieldBySchema(
    getFieldSchema,
    getFieldType,
    'wrapperField',
    'testPayload1',
    parents,
  ) as ReactElement<FieldComponentProps<
  any,
  any,
  any,
  any,
  any,
  any
  >, FC>;

  const {
    props: wrapperProps,
  } = wrapperNode;

  expect(wrapperProps.name).toBe('wrapperField');
  expect(wrapperProps.fieldSchema).toBe(wrapperSchema);
  expect(wrapperProps.payload).toBe('testPayload1');
  expect(wrapperProps.getFieldSchema).toBe(nextGetFieldSchema);
  expect(wrapperProps.getFieldType).toBe(getFieldType);
  expect(wrapperProps.parents).toBe(parents);

  expect(createGetFieldSchema).toHaveBeenCalledTimes(1);
  expect(createGetFieldSchema).toHaveBeenCalledWith(
    wrapperSchema,
    getFieldSchema,
    getFieldType,
    {
      fieldName: 'value',
    },
    'render',
    parents,
  );

  expect(getFieldSchema.mock.calls.length).toBe(1);
  expect(getFieldSchema.mock.calls[0][0]).toBe('wrapperField');

  expect(getFieldType.mock.calls.length).toBe(1);
  expect(getFieldType.mock.calls[0][0]).toBe(wrapperSchema);

  const {
    renderField,
  } = wrapperProps;

  const childNode = renderField('childField', 'testPayload2') as ReactElement<FieldComponentProps<
  any,
  any,
  any,
  any,
  any,
  any
  >, FC>;

  const {
    props: childProps,
  } = childNode;

  expect(childProps.name).toBe('childField');
  expect(childProps.fieldSchema).toBe(childSchema);
  expect(childProps.payload).toBe('testPayload2');
  expect(childProps.getFieldSchema).toBe(nextGetFieldSchema);
  expect(childProps.getFieldType).toBe(getFieldType);
  expect(childProps.parents).toBe(parents);

  expect(nextGetFieldSchema).toHaveBeenCalledTimes(1);
  expect(nextGetFieldSchema).toHaveBeenCalledWith('childField');

  expect(getFieldType).toHaveBeenCalledTimes(2);
  expect(getFieldType).toHaveBeenLastCalledWith(childSchema);
});

test('should redefine parents in rendered field', () => {
  function WrapperComponent(): ReactElement {
    return <div />;
  }

  function ChildComponent(): ReactElement {
    return <div />;
  }

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
      component: WrapperComponent as FC<FieldComponentProps<
      any,
      any,
      any,
      any,
      any,
      any
      >>,
    },

    child: {
      component: ChildComponent as FC<FieldComponentProps<
      any,
      any,
      any,
      any,
      any,
      any
      >>,
    },
  };

  const getFieldSchema = jest.fn<any, [
    string,
  ]>()
    .mockReturnValue(wrapperSchema);
  const getFieldType = jest.fn(({ type }) => fieldTypes[type]);

  const parents: ParentType[] = [
    {
      values: {
        fieldName: 'value',
      },
    },
  ];

  const wrapperNode = renderFieldBySchema(
    getFieldSchema,
    getFieldType,
    'wrapperField',
    'testPayload1',
    parents,
  ) as ReactElement<FieldComponentProps<
  any,
  any,
  any,
  any,
  any,
  any
  >, FC>;

  const {
    props: wrapperProps,
  } = wrapperNode;

  expect(wrapperProps.name).toBe('wrapperField');
  expect(wrapperProps.fieldSchema).toBe(wrapperSchema);
  expect(wrapperProps.payload).toBe('testPayload1');
  expect(wrapperProps.getFieldSchema).toBe(nextGetFieldSchema);
  expect(wrapperProps.getFieldType).toBe(getFieldType);
  expect(wrapperProps.parents).toBe(parents);

  expect(createGetFieldSchema).toHaveBeenCalledTimes(1);
  expect(createGetFieldSchema).toHaveBeenCalledWith(
    wrapperSchema,
    getFieldSchema,
    getFieldType,
    {
      fieldName: 'value',
    },
    'render',
    parents,
  );

  expect(getFieldSchema).toHaveBeenCalledTimes(1);
  expect(getFieldSchema).toHaveBeenCalledWith('wrapperField');

  expect(getFieldType).toHaveBeenCalledTimes(1);
  expect(getFieldType).toHaveBeenCalledWith(wrapperSchema);

  const {
    renderField,
  } = wrapperProps;

  const childParents: ParentType[] = [
    {
      values: {},
    },

    {
      name: 'child',
      values: {},
    },
  ];

  const childNode = renderField(
    'childField',
    'testPayload2',
    childParents,
  ) as ReactElement<FieldComponentProps<
  any,
  any,
  any,
  any,
  any,
  any
  >, FC>;

  const {
    props: childProps,
  } = childNode;

  expect(childProps.name).toBe('childField');
  expect(childProps.fieldSchema).toBe(childSchema);
  expect(childProps.payload).toBe('testPayload2');
  expect(childProps.getFieldSchema).toBe(nextGetFieldSchema);
  expect(childProps.getFieldType).toBe(getFieldType);
  expect(childProps.parents).toBe(childParents);

  expect(nextGetFieldSchema).toHaveBeenCalledTimes(1);
  expect(nextGetFieldSchema).toHaveBeenCalledWith('childField');

  expect(getFieldType).toHaveBeenCalledTimes(2);
  expect(getFieldType).toHaveBeenLastCalledWith(childSchema);
});
