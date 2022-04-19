/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Form as FinalForm,
} from 'react-final-form';
import {
  shallow,
} from 'enzyme';
import type {
  ShallowWrapper,
} from 'enzyme';
import type {
  ReactNode,
} from 'react';

import { Form } from '../Form';
import {
  IS_VALUES_READY_NAME,
} from '../constants';

import type {
  FormProps,
  RenderFieldBySchema,
} from '../types';

type Values = Record<string, any>;
type Errors = Record<string, any>;

const defaultProps: FormProps<any, Values, Values, Values, Errors, any> = {
  names: [],
  children: (): ReactNode => null,
  formSchemaValidateBeforeSubmit: () => ({}) as any,
  formSchemaParse: (): any => ({}),
  onSubmit: (): void => {},
};

type PageObject = {
  getFinalFormNode: () => ShallowWrapper<FormProps<any, Values, Values, Values, Errors, any>>;
};

const setup = (props: Partial<FormProps<any, Values, Values, Values, Errors, any>>): PageObject => {
  const wrapper = shallow(
    <Form
      {...defaultProps}
      {...props}
    />,
  );

  const getFinalFormNode = (): ShallowWrapper<FormProps<
  any,
  Values,
  Values,
  Values,
  Errors,
  any>> => wrapper.find(FinalForm);

  return {
    getFinalFormNode,
  };
};

afterEach(() => {
  jest.clearAllMocks();
});

test('should provide parsed initial values', () => {
  const getFieldSchema = jest.fn();
  const getFieldType = jest.fn();
  const names = ['test'];

  const initialValues = {
    test1: 'value1',
  };

  const parsedValues = {
    test2: 'value2',
  };

  const parse = jest.fn()
    .mockReturnValue(parsedValues);

  const page = setup({
    initialValues,
    getFieldSchema,
    getFieldType,
    names,

    formSchemaParse: parse,
  });

  const formNode = page.getFinalFormNode();

  expect(formNode.prop('initialValues')).toEqual({
    ...parsedValues,
    [IS_VALUES_READY_NAME]: true,
  });

  expect(parse).toHaveBeenCalledTimes(1);
  expect(parse).toHaveBeenCalledWith(
    initialValues,
    names,
    getFieldSchema,
    getFieldType,
    [
      {
        values: initialValues,
      },
    ],
  );
});

test('should not provide initial values during asynchronous parse', () => {
  const getFieldSchema = jest.fn();
  const getFieldType = jest.fn();
  const names = ['test'];

  const initialValues = {
    test1: 'value1',
  };

  const parsedValues = {
    test2: 'value2',
  };

  const parse = jest.fn()
    .mockResolvedValue(parsedValues);

  const useAsync = jest.fn()
    .mockReturnValue({
      result: undefined,
    });

  const page = setup({
    initialValues,
    getFieldSchema,
    getFieldType,
    names,

    formSchemaParse: parse,
    useAsync,
  });

  const formNode = page.getFinalFormNode();

  expect(formNode.prop('initialValues')).toEqual({
    [IS_VALUES_READY_NAME]: false,
  });

  expect(parse).toHaveBeenCalledTimes(1);
  expect(parse).toHaveBeenCalledWith(
    initialValues,
    names,
    getFieldSchema,
    getFieldType,
    [
      {
        values: initialValues,
      },
    ],
  );
});

test('should not provide initial values with `initialValuesPlaceholder` during asynchronous parse', () => {
  const getFieldSchema = jest.fn();
  const getFieldType = jest.fn();
  const names = ['test'];

  const initialValues = {
    test1: 'value1',
  };

  const parsedValues = {
    test2: 'value2',
  };

  const parse = jest.fn()
    .mockResolvedValue(parsedValues);

  const useAsync = jest.fn()
    .mockReturnValue({
      result: undefined,
    });

  const page = setup({
    initialValues,

    initialValuesPlaceholder: {
      test: 'placeholderValue',
    },

    getFieldSchema,
    getFieldType,
    names,

    formSchemaParse: parse,
    useAsync,
  });

  const formNode = page.getFinalFormNode();

  expect(formNode.prop('initialValues')).toEqual({
    [IS_VALUES_READY_NAME]: false,
    test: 'placeholderValue',
  });

  expect(parse).toHaveBeenCalledTimes(1);
  expect(parse).toHaveBeenCalledWith(
    initialValues,
    names,
    getFieldSchema,
    getFieldType,
    [
      {
        values: initialValues,
      },
    ],
  );
});

test('should provide initial values after asynchronous parse', () => {
  const getFieldSchema = jest.fn();
  const getFieldType = jest.fn();
  const names = ['test'];

  const initialValues = {
    test1: 'value1',
  };

  const parsedValues = {
    test2: 'value2',
  };

  const asyncParsedValues = {
    test3: 'value3',
  };

  const parse = jest.fn()
    .mockResolvedValue(parsedValues);

  const useAsync = jest.fn()
    .mockReturnValue({
      result: asyncParsedValues,
    });

  const page = setup({
    initialValues,
    getFieldSchema,
    getFieldType,
    names,

    formSchemaParse: parse,
    useAsync,
  });

  const formNode = page.getFinalFormNode();

  expect(formNode.prop('initialValues')).toEqual({
    ...asyncParsedValues,
    [IS_VALUES_READY_NAME]: true,
  });

  expect(parse).toHaveBeenCalledTimes(1);
  expect(parse).toHaveBeenCalledWith(
    initialValues,
    names,
    getFieldSchema,
    getFieldType,
    [
      {
        values: initialValues,
      },
    ],
  );
});

test('should provide empty object to parser if initial values not defined', () => {
  const getFieldSchema = jest.fn();
  const getFieldType = jest.fn();
  const names = ['test'];

  const parsedValues = {
    test2: 'value2',
  };

  const parse = jest.fn()
    .mockReturnValue(parsedValues);

  const page = setup({
    getFieldSchema,
    getFieldType,
    names,

    formSchemaParse: parse,
  });

  const formNode = page.getFinalFormNode();

  expect(formNode.prop('initialValues')).toEqual({
    ...parsedValues,
    [IS_VALUES_READY_NAME]: true,
  });

  expect(parse).toHaveBeenCalledTimes(1);
  expect(parse).toHaveBeenCalledWith(
    {},
    names,
    getFieldSchema,
    getFieldType,
    [
      {
        values: {},
      },
    ],
  );
});

test('should validate before submit', async () => {
  const getFieldSchema = jest.fn();
  const getFieldType = jest.fn();
  const names = ['test'];

  const values = {
    test1: 'value1',
  };

  const clientErrors = {
    test2: 'error2',
  };

  const validateBeforeSubmit = jest.fn()
    .mockReturnValue(clientErrors);

  const serialize = jest.fn();
  const onSubmit = jest.fn();
  const mapErrors = jest.fn();
  const mapFieldErrors = jest.fn();

  const page = setup({
    getFieldSchema,
    getFieldType,
    names,

    mapErrors,

    onSubmit,

    formSchemaValidateBeforeSubmit: validateBeforeSubmit,
    formSchemaSerialize: serialize,
    formSchemaMapFieldErrors: mapFieldErrors,
  });

  const formNode = page.getFinalFormNode();

  const result = await formNode.prop('onSubmit')(values, {});

  expect(result).toBe(clientErrors);

  expect(validateBeforeSubmit).toHaveBeenCalledTimes(1);
  expect(validateBeforeSubmit).toHaveBeenCalledWith(
    values,
    names,
    getFieldSchema,
    getFieldType,
    [
      {
        values,
      },
    ],
  );

  expect(serialize).toHaveBeenCalledTimes(0);
  expect(onSubmit).toHaveBeenCalledTimes(0);
  expect(mapErrors).toHaveBeenCalledTimes(0);
  expect(mapFieldErrors).toHaveBeenCalledTimes(0);
});

test('should submit successfully', async () => {
  const getFieldSchema = jest.fn();
  const getFieldType = jest.fn();
  const names = ['test'];

  const values = {
    test1: 'value1',
  };

  const serializedValues = {
    test2: 'value2',
  };

  const serialize = jest.fn()
    .mockReturnValue(serializedValues);

  const onSubmit = jest.fn();
  const mapErrors = jest.fn();
  const mapFieldErrors = jest.fn();

  const page = setup({
    getFieldSchema,
    getFieldType,
    names,

    mapErrors,

    onSubmit,

    formSchemaSerialize: serialize,
    formSchemaMapFieldErrors: mapFieldErrors,
  });

  const formNode = page.getFinalFormNode();

  const result = await formNode.prop('onSubmit')(values, {});

  expect(result).toBeFalsy();

  expect(serialize).toHaveBeenCalledTimes(1);
  expect(serialize).toHaveBeenCalledWith(
    values,
    names,
    getFieldSchema,
    getFieldType,
    [
      {
        values,
      },
    ],
  );

  expect(onSubmit).toHaveBeenCalledTimes(1);
  expect(onSubmit).toHaveBeenCalledWith(
    serializedValues,
    values,
  );

  expect(mapErrors).toHaveBeenCalledTimes(0);
  expect(mapFieldErrors).toHaveBeenCalledTimes(0);
});

test('should submit with error', async () => {
  const getFieldSchema = jest.fn();
  const getFieldType = jest.fn();
  const names = ['test'];

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

  const serialize = jest.fn()
    .mockReturnValue(serializedValues);

  const onSubmit = jest.fn<any, [
    Values,
    Values,
  ]>(() => rawErrors);
  const mapErrors = jest.fn<any, [
    Errors,
    Values,
    Values,
  ]>(() => preparedErrors);
  const mapFieldErrors = jest.fn()
    .mockReturnValue(errors);

  const page = setup({
    getFieldSchema,
    getFieldType,
    names,

    mapErrors,

    onSubmit,

    formSchemaSerialize: serialize,
    formSchemaMapFieldErrors: mapFieldErrors,
  });

  const formNode = page.getFinalFormNode();

  const result = await formNode.prop('onSubmit')(values, {});

  expect(result).toBe(errors);

  expect(serialize).toHaveBeenCalledTimes(1);
  expect(serialize).toHaveBeenCalledWith(
    values,
    names,
    getFieldSchema,
    getFieldType,
    [
      {
        values,
      },
    ],
  );

  expect(onSubmit).toHaveBeenCalledTimes(1);
  expect(onSubmit).toHaveBeenCalledWith(
    serializedValues,
    values,
  );

  expect(mapErrors).toHaveBeenCalledTimes(1);
  expect(mapErrors).toHaveBeenCalledWith(
    rawErrors,
    serializedValues,
    values,
  );

  expect(mapFieldErrors).toHaveBeenCalledTimes(1);
  expect(mapFieldErrors).toHaveBeenCalledWith(
    preparedErrors,
    names,
    getFieldSchema,
    getFieldType,
    serializedValues,
    values,
    [
      {
        values,
      },
    ],
  );
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

  const formNode = page.getFinalFormNode();

  formNode.prop('children')({
    testProp: 'testValue',
  } as any);

  expect(children.mock.calls.length).toBe(1);
  expect(children.mock.calls[0][0].testProp).toBe('testValue');
});

test('should render field', () => {
  const renderFieldBySchema = jest.fn<any, Parameters<RenderFieldBySchema<
  any,
  any,
  any,
  any,
  any,
  any
  >>>()
    .mockReturnValue('test field');

  const getFieldSchema = jest.fn();
  const getFieldType = jest.fn();

  const children = jest.fn();

  const page = setup({
    getFieldSchema,
    getFieldType,

    children,

    renderFieldBySchema,
  });

  const formNode = page.getFinalFormNode();

  formNode.prop('children')({
    values: {
      fieldName: 'value',
    },
  } as any);

  const {
    renderField,
  } = children.mock.calls[0][0];

  const renderedField = renderField('testField', 'testPayload');

  expect(renderedField).toBe('test field');

  expect(renderFieldBySchema).toHaveBeenCalledTimes(1);
  expect(renderFieldBySchema).toHaveBeenCalledWith(
    getFieldSchema,
    getFieldType,
    'testField',
    'testPayload',
    [
      {
        values: {
          fieldName: 'value',
        },
      },
    ],
  );
});
