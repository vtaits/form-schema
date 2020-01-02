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
  const FieldComponent = () => <div />;

  const fieldType = {
    component: FieldComponent,
  };

  const fieldSchema = Symbol('field schema');

  const getFieldSchema = jest.fn(() => fieldSchema);
  const getFieldType = jest.fn(() => fieldType);

  const children = jest.fn();

  const page = setup({
    getFieldSchema,
    getFieldType,

    children,
  });

  const formNode = page.getFormNode();

  formNode.prop('children')({});

  const {
    renderField,
  } = children.mock.calls[0][0];

  const renderedField = renderField('testField', 'testPayload');

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
  const FieldComponent = () => <div />;

  const nextGetFieldSchema = jest.fn();

  const createGetFieldSchema = jest.fn(() => nextGetFieldSchema);

  const fieldType = {
    createGetFieldSchema,
    component: FieldComponent,
  };

  const fieldSchema = Symbol('field schema');

  const getFieldSchema = jest.fn(() => fieldSchema);
  const getFieldType = jest.fn(() => fieldType);

  const children = jest.fn();

  const page = setup({
    getFieldSchema,
    getFieldType,

    children,
  });

  const formNode = page.getFormNode();

  formNode.prop('children')({});

  const {
    renderField,
  } = children.mock.calls[0][0];

  const renderedField = renderField('testField', 'testPayload');

  const fieldWrapper = shallow(
    <div>
      {renderedField}
    </div>,
  );

  const fieldNode = fieldWrapper.find(FieldComponent);

  expect(fieldNode.prop('fieldUniq')).toBe('testField');
  expect(fieldNode.prop('fieldSchema')).toBe(fieldSchema);
  expect(fieldNode.prop('payload')).toBe('testPayload');
  expect(fieldNode.prop('getFieldSchema')).toBe(nextGetFieldSchema);
  expect(fieldNode.prop('getFieldType')).toBe(getFieldType);

  expect(createGetFieldSchema.mock.calls.length).toBe(1);
  expect(createGetFieldSchema.mock.calls[0][0]).toBe(fieldSchema);
  expect(createGetFieldSchema.mock.calls[0][1]).toBe(getFieldSchema);

  expect(getFieldSchema.mock.calls.length).toBe(1);
  expect(getFieldSchema.mock.calls[0][0]).toBe('testField');

  expect(getFieldType.mock.calls.length).toBe(1);
  expect(getFieldType.mock.calls[0][0]).toBe(fieldSchema);
});
