/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Form as FinalForm,
} from 'react-final-form';

import { createRenderer } from 'react-test-renderer/shallow';

import type {
  ReactElement,
  ReactNode,
} from 'react';

import * as reactAsyncHookMocks from 'react-async-hook';

import * as formSchema from '@vtaits/form-schema';

import { Form } from '../Form';
import {
  IS_VALUES_READY_NAME,
} from '../constants';

import * as renderFieldBySchemaMock from '../renderFieldBySchema';

import type {
  FormProps,
} from '../types';

jest.mock('react-async-hook');
jest.mock('@vtaits/form-schema');
jest.mock('../renderFieldBySchema');

afterEach(() => {
  jest.clearAllMocks();
});

type Values = Record<string, any>;
type Errors = Record<string, any>;

const defaultProps: FormProps<any, Values, Values, Values, Errors, any> = {
  names: [],
  children: (): ReactNode => null,
  onSubmit: (): void => {},
};

type PageObject = {
  getFinalFormProps: () => FormProps<any, Values, Values, Values, Errors, any>;
};

const setup = (props: Partial<FormProps<any, Values, Values, Values, Errors, any>>): PageObject => {
  const renderer = createRenderer();

  renderer.render(
    <Form
      {...defaultProps}
      {...props}
    />,
  );

  const result = renderer.getRenderOutput() as ReactElement<
  FormProps<any, Values, Values, Values, Errors, any>,
  typeof FinalForm
  >;

  const getFinalFormProps = () => result.props;

  return {
    getFinalFormProps,
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

  (formSchema.parse as jest.Mock).mockReturnValue(parsedValues);

  (reactAsyncHookMocks.useAsync as jest.Mock).mockReturnValue({
    result: undefined,
  });

  const page = setup({
    initialValues,
    getFieldSchema,
    getFieldType,
    names,
  });

  const formProps = page.getFinalFormProps();

  expect(formProps.initialValues).toEqual({
    ...parsedValues,
    [IS_VALUES_READY_NAME]: true,
  });

  expect(formSchema.parse).toHaveBeenCalledTimes(1);
  expect(formSchema.parse).toHaveBeenCalledWith(
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

  (formSchema.parse as jest.Mock).mockResolvedValue(parsedValues);

  (reactAsyncHookMocks.useAsync as jest.Mock).mockReturnValue({
    result: undefined,
  });

  const page = setup({
    initialValues,
    getFieldSchema,
    getFieldType,
    names,
  });

  const formProps = page.getFinalFormProps();

  expect(formProps.initialValues).toEqual({
    [IS_VALUES_READY_NAME]: false,
  });

  expect(formSchema.parse).toHaveBeenCalledTimes(1);
  expect(formSchema.parse).toHaveBeenCalledWith(
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

  (formSchema.parse as jest.Mock).mockResolvedValue(parsedValues);

  (reactAsyncHookMocks.useAsync as jest.Mock).mockReturnValue({
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
  });

  const formProps = page.getFinalFormProps();

  expect(formProps.initialValues).toEqual({
    [IS_VALUES_READY_NAME]: false,
    test: 'placeholderValue',
  });

  expect(formSchema.parse).toHaveBeenCalledTimes(1);
  expect(formSchema.parse).toHaveBeenCalledWith(
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

  (formSchema.parse as jest.Mock).mockResolvedValue(parsedValues);

  (reactAsyncHookMocks.useAsync as jest.Mock).mockReturnValue({
    result: asyncParsedValues,
  });

  const page = setup({
    initialValues,
    getFieldSchema,
    getFieldType,
    names,
  });

  const formProps = page.getFinalFormProps();

  expect(formProps.initialValues).toEqual({
    ...asyncParsedValues,
    [IS_VALUES_READY_NAME]: true,
  });

  expect(formSchema.parse).toHaveBeenCalledTimes(1);
  expect(formSchema.parse).toHaveBeenCalledWith(
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

  (formSchema.parse as jest.Mock).mockReturnValue(parsedValues);

  const page = setup({
    getFieldSchema,
    getFieldType,
    names,
  });

  const formProps = page.getFinalFormProps();

  expect(formProps.initialValues).toEqual({
    ...parsedValues,
    [IS_VALUES_READY_NAME]: true,
  });

  expect(formSchema.parse).toHaveBeenCalledTimes(1);
  expect(formSchema.parse).toHaveBeenCalledWith(
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

  (formSchema.validateBeforeSubmit as jest.Mock).mockReturnValue(clientErrors);

  const onSubmit = jest.fn();
  const mapErrors = jest.fn();

  const page = setup({
    getFieldSchema,
    getFieldType,
    names,

    mapErrors,

    onSubmit,
  });

  const formProps = page.getFinalFormProps();

  const result = await formProps.onSubmit(values, {});

  expect(result).toBe(clientErrors);

  expect(formSchema.validateBeforeSubmit).toHaveBeenCalledTimes(1);
  expect(formSchema.validateBeforeSubmit).toHaveBeenCalledWith(
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

  expect(formSchema.serialize).toHaveBeenCalledTimes(0);
  expect(onSubmit).toHaveBeenCalledTimes(0);
  expect(mapErrors).toHaveBeenCalledTimes(0);
  expect(formSchema.mapFieldErrors).toHaveBeenCalledTimes(0);
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

  (formSchema.serialize as jest.Mock).mockReturnValue(serializedValues);
  (formSchema.validateBeforeSubmit as jest.Mock).mockReturnValue({});

  const onSubmit = jest.fn();
  const mapErrors = jest.fn();

  const page = setup({
    getFieldSchema,
    getFieldType,
    names,

    mapErrors,

    onSubmit,
  });

  const formProps = page.getFinalFormProps();

  const result = await formProps.onSubmit(values, {});

  expect(result).toBeFalsy();

  expect(formSchema.serialize).toHaveBeenCalledTimes(1);
  expect(formSchema.serialize).toHaveBeenCalledWith(
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
  expect(formSchema.mapFieldErrors).toHaveBeenCalledTimes(0);
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

  (formSchema.serialize as jest.Mock).mockReturnValue(serializedValues);

  const onSubmit = jest.fn<any, [
    Values,
    Values,
  ]>(() => rawErrors);
  const mapErrors = jest.fn<any, [
    Errors,
    Values,
    Values,
  ]>(() => preparedErrors);

  (formSchema.mapFieldErrors as jest.Mock).mockReturnValue(errors);

  const page = setup({
    getFieldSchema,
    getFieldType,
    names,

    mapErrors,

    onSubmit,
  });

  const formProps = page.getFinalFormProps();

  const result = await formProps.onSubmit(values, {});

  expect(result).toBe(errors);

  expect(formSchema.serialize).toHaveBeenCalledTimes(1);
  expect(formSchema.serialize).toHaveBeenCalledWith(
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

  expect(formSchema.mapFieldErrors).toHaveBeenCalledTimes(1);
  expect(formSchema.mapFieldErrors).toHaveBeenCalledWith(
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

  const formProps = page.getFinalFormProps();

  formProps.children({
    testProp: 'testValue',
  } as any);

  expect(children).toHaveBeenCalledTimes(1);
  expect(children.mock.calls[0][0].testProp).toBe('testValue');
});

test('should render field', () => {
  (renderFieldBySchemaMock.renderFieldBySchema as jest.Mock).mockReturnValue('test field');

  const getFieldSchema = jest.fn();
  const getFieldType = jest.fn();

  const children = jest.fn();

  const page = setup({
    getFieldSchema,
    getFieldType,

    children,
  });

  const formProps = page.getFinalFormProps();

  formProps.children({
    values: {
      fieldName: 'value',
    },
  } as any);

  const {
    renderField,
  } = children.mock.calls[0][0];

  const renderedField = renderField('testField', 'testPayload');

  expect(renderedField).toBe('test field');

  expect(renderFieldBySchemaMock.renderFieldBySchema).toHaveBeenCalledTimes(1);
  expect(renderFieldBySchemaMock.renderFieldBySchema).toHaveBeenCalledWith(
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
