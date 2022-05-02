/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useFormState,
} from 'react-final-form';

import { createRenderer } from 'react-test-renderer/shallow';

import type {
  FC,
  ReactElement,
} from 'react';

import type {
  ParentType,
} from '@vtaits/form-schema';

import type {
  FieldType,
  FieldComponentProps,
} from '../../../core';

import { DynamicField } from '../component';
import type {
  DynamicFieldProps,
} from '../component';

const parents: ParentType[] = [
  {
    values: {},
  },
];

function TestComponent(): ReactElement {
  return null;
}

const fieldType: FieldType<any> = {
  component: TestComponent as FC<FieldComponentProps<any>>,
};

const defaultUseForm = jest.fn();
const defaultUseFormState = jest.fn()
  .mockReturnValue({});
const defaultUseFormSchemaState = jest.fn()
  .mockReturnValue({
    isValuesReady: false,
  });
const defaultUseEffect = jest.fn();
const defaultUseRef = jest.fn();

const defaultProps: DynamicFieldProps<
any,
any,
any,
any,
any,
any
> = {
  fieldSchema: {
    getSchema: () => 'test',
  },
  name: 'testName',
  getFieldSchema: jest.fn(),
  getFieldType: jest.fn().mockReturnValue(fieldType),
  renderField: jest.fn(),
  parents,
  useForm: defaultUseForm,
  useFormState: defaultUseFormState,
  useFormSchemaState: defaultUseFormSchemaState,
  useEffect: defaultUseEffect,
  useRef: defaultUseRef,
};

function setup<
FieldSchema,
Values extends Record<string, any>,
RawValues extends Record<string, any>,
SerializedValues extends Record<string, any>,
Errors extends Record<string, any>,
Payload,
>(props: Partial<DynamicFieldProps<
FieldSchema,
Values,
RawValues,
SerializedValues,
Errors,
Payload
>>) {
  const renderer = createRenderer();

  renderer.render(
    <DynamicField
      {...defaultProps}
      {...props}
    />,
  );

  const result = renderer.getRenderOutput() as ReactElement<
  FieldComponentProps<any>,
  FC | null
  >;

  return result;
}

describe('getSchema', () => {
  test('should provide form values to `getSchema`', () => {
    const getSchema = jest.fn();
    const getFieldSchema = () => null;
    const getFieldType = () => fieldType;

    const values: Record<string, any> = {
      field1: 'value1',
    };

    setup({
      fieldSchema: {
        getSchema,
      },
      name: 'test',
      getFieldSchema,
      getFieldType,
      renderField: () => null,
      useFormState: (() => ({
        values,
      })) as unknown as typeof useFormState,
    });

    expect(getSchema).toHaveBeenCalledTimes(1);
    expect(getSchema).toHaveBeenCalledWith(
      values,
      'render',
      getFieldSchema,
      getFieldType,
      parents,
    );
  });

  test('should not render anything if `getSchema` returns falsy value', () => {
    const wrapper = setup({
      fieldSchema: {
        getSchema: () => null,
      },
      name: 'test',
      getFieldSchema: () => null,
      getFieldType: () => fieldType,
      renderField: () => null,
    });

    expect(wrapper).toBe(null);
  });

  test('should render component if `getSchema` returns truthy value', () => {
    const wrapper = setup({
      fieldSchema: {
        getSchema: () => 'test',
      },
      name: 'test',
      getFieldSchema: () => null,
      getFieldType: () => fieldType,
      renderField: () => null,
    });

    expect(wrapper.type).toBe(TestComponent);
  });
});

describe('getFieldType', () => {
  test('should call `getFieldType` with correct argument', () => {
    const getFieldType = jest.fn()
      .mockReturnValue(fieldType);

    setup({
      fieldSchema: {
        getSchema: () => 'test',
      },
      name: 'test',
      getFieldSchema: () => null,
      getFieldType,
      renderField: () => null,
    });

    expect(getFieldType).toHaveBeenCalledTimes(1);
    expect(getFieldType).toHaveBeenCalledWith('test');
  });
});

describe('render', () => {
  test('should provide correct props to rendered component', () => {
    const getFieldSchema = jest.fn();
    const renderField = jest.fn();
    const getFieldType = jest.fn()
      .mockReturnValue(fieldType);

    const wrapper = setup({
      fieldSchema: {
        getSchema: () => 'test',
      },
      name: 'testName',
      getFieldSchema,
      getFieldType,
      renderField,
    });

    const allProps = wrapper.props;

    expect(allProps.fieldSchema).toBe('test');
    expect(allProps.name).toBe('testName');
    expect(allProps.getFieldSchema).toBe(getFieldSchema);
    expect(allProps.getFieldType).toBe(getFieldType);
    expect(allProps.renderField).toBe(renderField);
    expect(allProps.parents).toBe(parents);
  });
});

describe('callbacks', () => {
  function setupForCallbacks<
  FieldSchema,
  Values extends Record<string, any>,
  RawValues extends Record<string, any>,
  SerializedValues extends Record<string, any>,
  Errors extends Record<string, any>,
  Payload,
  >(
    isValuesReady: boolean,
    isFirstRender: boolean,
    props: Partial<DynamicFieldProps<
    FieldSchema,
    Values,
    RawValues,
    SerializedValues,
    Errors,
    Payload
    >>,
  ) {
    const useEffect = jest.fn<void, [() => void, readonly any[]]>();

    const useFormSchemaState = jest.fn()
      .mockReturnValue({
        isValuesReady,
      });

    const refValue = {
      current: isFirstRender,
    };

    const useRef = jest.fn()
      .mockReturnValue(refValue);

    setup({
      ...props,
      useEffect,
      useRef,
      useFormSchemaState,
    });

    expect(useEffect).toBeCalledTimes(1);
    const effect = useEffect.mock.calls[0][0];

    effect();

    return [refValue];
  }

  test('should not call `onShow` if values are not ready and not change `isFirstRender`', () => {
    const onShow = jest.fn();
    const onHide = jest.fn();

    const [{
      current: isFirstRender,
    }] = setupForCallbacks(false, false, {
      fieldSchema: {
        getSchema: () => 'schema',
        onShow,
        onHide,
      },
    });

    expect(onShow).toHaveBeenCalledTimes(0);
    expect(onHide).toHaveBeenCalledTimes(0);

    expect(isFirstRender).toBe(false);
  });

  test('should not call `onHide` if values are not ready and not change `isFirstRender`', () => {
    const onShow = jest.fn();
    const onHide = jest.fn();

    const [{
      current: isFirstRender,
    }] = setupForCallbacks(false, false, {
      fieldSchema: {
        getSchema: () => null,
        onShow,
        onHide,
      },
    });

    expect(onShow).toHaveBeenCalledTimes(0);
    expect(onHide).toHaveBeenCalledTimes(0);

    expect(isFirstRender).toBe(false);
  });

  test('should not call `onShow` in first render and change `isFirstRender`', () => {
    const onShow = jest.fn();
    const onHide = jest.fn();

    const [{
      current: isFirstRender,
    }] = setupForCallbacks(true, true, {
      fieldSchema: {
        getSchema: () => 'schema',
        onShow,
        onHide,
      },
    });

    expect(onShow).toHaveBeenCalledTimes(0);
    expect(onHide).toHaveBeenCalledTimes(0);

    expect(isFirstRender).toBe(false);
  });

  test('should not call `onHide` in first render and change `isFirstRender`', () => {
    const onShow = jest.fn();
    const onHide = jest.fn();

    const [{
      current: isFirstRender,
    }] = setupForCallbacks(true, true, {
      fieldSchema: {
        getSchema: () => null,
        onShow,
        onHide,
      },
    });

    expect(onShow).toHaveBeenCalledTimes(0);
    expect(onHide).toHaveBeenCalledTimes(0);

    expect(isFirstRender).toBe(false);
  });

  test('should call `onShow` and not change `isFirstRender`', () => {
    const form = Symbol('form');
    const useForm = jest.fn()
      .mockReturnValue(form);

    const onShow = jest.fn();
    const onHide = jest.fn();

    const [{
      current: isFirstRender,
    }] = setupForCallbacks(true, false, {
      fieldSchema: {
        getSchema: () => 'schema',
        onShow,
        onHide,
      },

      useForm,
    });

    expect(onShow).toHaveBeenCalledTimes(1);
    expect(onShow).toHaveBeenCalledWith(
      form,
      'testName',
      'schema',
      defaultProps.getFieldSchema,
      defaultProps.getFieldType,
      parents,
    );

    expect(onHide).toHaveBeenCalledTimes(0);

    expect(isFirstRender).toBe(false);
  });

  test('should call `onHide` and not change `isFirstRender`', () => {
    const form = Symbol('form');
    const useForm = jest.fn()
      .mockReturnValue(form);

    const onShow = jest.fn();
    const onHide = jest.fn();

    const [{
      current: isFirstRender,
    }] = setupForCallbacks(true, false, {
      fieldSchema: {
        getSchema: () => null,
        onShow,
        onHide,
      },

      useForm,
    });

    expect(onShow).toHaveBeenCalledTimes(0);

    expect(onHide).toHaveBeenCalledTimes(1);
    expect(onHide).toHaveBeenCalledWith(
      form,
      'testName',
      defaultProps.getFieldSchema,
      defaultProps.getFieldType,
      parents,
    );

    expect(isFirstRender).toBe(false);
  });
});
