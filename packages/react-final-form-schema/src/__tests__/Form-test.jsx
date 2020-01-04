import React from 'react';
import { shallow } from 'enzyme';

import { Form } from 'react-final-form';

import FormWrapper from '../Form';

const defaultProps = {
  schema: [],
  children: () => null,
  formSchemaParse: () => ({}),
  onSubmit: Function.prototype,
};

const setup = (props) => {
  const wrapper = shallow(
    <FormWrapper
      {...defaultProps}
      {...props}
    />,
  );

  const getFormNode = () => wrapper.find(Form);

  return {
    getFormNode,
  };
};

afterEach(() => {
  jest.clearAllMocks();
});

test('should provide parsed initial values', () => {
  const getFieldSchema = jest.fn();
  const getFieldType = jest.fn();
  const schema = ['test'];

  const initialValues = {
    test1: 'value1',
  };

  const parsedValues = {
    test2: 'value2',
  };

  const parse = jest.fn(() => parsedValues);

  const page = setup({
    initialValues,
    getFieldSchema,
    getFieldType,
    schema,

    formSchemaParse: parse,
  });

  const formNode = page.getFormNode();

  expect(formNode.prop('initialValues')).toBe(parsedValues);

  expect(parse.mock.calls.length).toBe(1);
  expect(parse.mock.calls[0][0]).toBe(initialValues);
  expect(parse.mock.calls[0][1]).toBe(schema);
  expect(parse.mock.calls[0][2]).toBe(getFieldSchema);
  expect(parse.mock.calls[0][3]).toBe(getFieldType);
});

test('should provide empty object to parser if initial values not defined', () => {
  const getFieldSchema = jest.fn();
  const getFieldType = jest.fn();
  const schema = ['test'];

  const parsedValues = {
    test2: 'value2',
  };

  const parse = jest.fn(() => parsedValues);

  const page = setup({
    getFieldSchema,
    getFieldType,
    schema,

    formSchemaParse: parse,
  });

  const formNode = page.getFormNode();

  expect(formNode.prop('initialValues')).toBe(parsedValues);

  expect(parse.mock.calls.length).toBe(1);
  expect(parse.mock.calls[0][0]).toEqual({});
  expect(parse.mock.calls[0][1]).toBe(schema);
  expect(parse.mock.calls[0][2]).toBe(getFieldSchema);
  expect(parse.mock.calls[0][3]).toBe(getFieldType);
});

test('should submit successfully', async () => {
  const getFieldSchema = jest.fn();
  const getFieldType = jest.fn();
  const schema = ['test'];

  const values = {
    test1: 'value1',
  };

  const serializedValues = {
    test2: 'value2',
  };

  const serialize = jest.fn(() => serializedValues);

  const onSubmit = jest.fn();
  const mapErrors = jest.fn();
  const mapFieldErrors = jest.fn();

  const page = setup({
    getFieldSchema,
    getFieldType,
    schema,

    mapErrors,

    onSubmit,

    formSchemaSerialize: serialize,
    formSchemaMapFieldErrors: mapFieldErrors,
  });

  const formNode = page.getFormNode();

  const result = await formNode.prop('onSubmit')(values);

  expect(result).toBeFalsy();

  expect(serialize.mock.calls.length).toBe(1);
  expect(serialize.mock.calls[0][0]).toBe(values);
  expect(serialize.mock.calls[0][1]).toBe(schema);
  expect(serialize.mock.calls[0][2]).toBe(getFieldSchema);
  expect(serialize.mock.calls[0][3]).toBe(getFieldType);

  expect(onSubmit.mock.calls.length).toBe(1);
  expect(onSubmit.mock.calls[0][0]).toBe(serializedValues);
  expect(onSubmit.mock.calls[0][1]).toBe(values);

  expect(mapErrors.mock.calls.length).toBe(0);
  expect(mapFieldErrors.mock.calls.length).toBe(0);
});

test('should submit with error', async () => {
  const getFieldSchema = jest.fn();
  const getFieldType = jest.fn();
  const schema = ['test'];

  const values = {
    test1: 'value1',
  };

  const serializedValues = {
    test2: 'value2',
  };

  const rawErrors = {
    test1: 'error1',
  };

  const preparedErrors = {
    test2: 'error2',
  };

  const errors = {
    test3: 'error3',
  };

  const serialize = jest.fn(() => serializedValues);

  const onSubmit = jest.fn(() => rawErrors);
  const mapErrors = jest.fn(() => preparedErrors);
  const mapFieldErrors = jest.fn(() => errors);

  const page = setup({
    getFieldSchema,
    getFieldType,
    schema,

    mapErrors,

    onSubmit,

    formSchemaSerialize: serialize,
    formSchemaMapFieldErrors: mapFieldErrors,
  });

  const formNode = page.getFormNode();

  const result = await formNode.prop('onSubmit')(values);

  expect(result).toBe(errors);

  expect(serialize.mock.calls.length).toBe(1);
  expect(serialize.mock.calls[0][0]).toBe(values);
  expect(serialize.mock.calls[0][1]).toBe(schema);
  expect(serialize.mock.calls[0][2]).toBe(getFieldSchema);
  expect(serialize.mock.calls[0][3]).toBe(getFieldType);

  expect(onSubmit.mock.calls.length).toBe(1);
  expect(onSubmit.mock.calls[0][0]).toBe(serializedValues);
  expect(onSubmit.mock.calls[0][1]).toBe(values);

  expect(mapErrors.mock.calls.length).toBe(1);
  expect(mapErrors.mock.calls[0][0]).toBe(rawErrors);
  expect(mapErrors.mock.calls[0][1]).toBe(serializedValues);
  expect(mapErrors.mock.calls[0][2]).toBe(values);

  expect(mapFieldErrors.mock.calls.length).toBe(1);
  expect(mapFieldErrors.mock.calls[0][0]).toBe(preparedErrors);
  expect(mapFieldErrors.mock.calls[0][1]).toBe(schema);
  expect(mapFieldErrors.mock.calls[0][2]).toBe(getFieldSchema);
  expect(mapFieldErrors.mock.calls[0][3]).toBe(getFieldType);
  expect(mapFieldErrors.mock.calls[0][4]).toBe(serializedValues);
  expect(mapFieldErrors.mock.calls[0][5]).toBe(values);
});

test('should provide form render props to children', () => {
  const getFieldSchema = jest.fn();
  const getFieldType = jest.fn();

  const children = jest.fn();

  const page = setup({
    getFieldSchema,
    getFieldType,

    children,
  });

  const formNode = page.getFormNode();

  formNode.prop('children')({
    testProp: 'testValue',
  });

  expect(children.mock.calls.length).toBe(1);
  expect(children.mock.calls[0][0].testProp).toBe('testValue');
});

test('should render field', () => {
  const renderFieldBySchema = jest.fn(() => 'test field');

  const getFieldSchema = jest.fn();
  const getFieldType = jest.fn();

  const children = jest.fn();

  const page = setup({
    getFieldSchema,
    getFieldType,

    children,

    renderFieldBySchema,
  });

  const formNode = page.getFormNode();

  formNode.prop('children')({});

  const {
    renderField,
  } = children.mock.calls[0][0];

  const renderedField = renderField('testField', 'testPayload');

  expect(renderedField).toBe('test field');

  expect(renderFieldBySchema.mock.calls.length).toBe(1);
  expect(renderFieldBySchema.mock.calls[0][0]).toBe(getFieldSchema);
  expect(renderFieldBySchema.mock.calls[0][1]).toBe(getFieldType);
  expect(renderFieldBySchema.mock.calls[0][2]).toBe('testField');
  expect(renderFieldBySchema.mock.calls[0][3]).toBe('testPayload');
});
