import { afterEach, describe, expect, test, vi } from 'vitest';
import type { FormApi, FormState } from 'final-form';
import {
  useForm,
  useFormState,
} from 'react-final-form';
import { create } from 'react-test-engine';
import {
  type FC,
  type ReactElement,
  useDebugValue,
  useEffect,
  useRef,
} from 'react';
import type {
  ParentType,
} from '@vtaits/form-schema';

import {
  useFormSchemaState,
  type FieldType,
  type FieldComponentProps,
} from '../../core';

import { DynamicField } from './component';
import type {
  DynamicFieldProps,
} from './component';

vi.mock('react', async () => {
  const actual = await vi.importActual('react') as Record<string, unknown>;

  return {
    ...actual,
    useEffect: vi.fn(),
    useRef: vi.fn(),
  };
});
vi.mock('react-final-form');
vi.mock('../../core');

const parents: ParentType[] = [
  {
    values: {},
  },
];

function TestComponent(props: FieldComponentProps<any>): ReactElement | null {
  useDebugValue(props);

  return null;
}

const fieldType: FieldType<any> = {
  component: TestComponent as FC<FieldComponentProps<any>>,
};

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
  getFieldSchema: vi.fn(),
  getFieldType: vi.fn().mockReturnValue(fieldType),
  parents,
};

const form = {
  TYPE: "FORM",
} as unknown as FormApi;

const render = create(DynamicField, defaultProps, {
  queries: {
    field: {
      component: TestComponent,
    },
  },

  hooks: {
    useEffect,
    useForm,
    useFormState,
    useFormSchemaState,
    useRef,
  },

  hookOrder: [
    'useForm',
    'useFormState',
    'useFormSchemaState',
    'useRef',
    'useEffect',
  ],

  hookDefaultValues: {
    useForm: form,
    useFormState: {
      values: {},
    } as FormState<Record<string, any>>,
    useFormSchemaState: {
      isValuesReady: false,
    },
    useRef: {
      current: true,
    },
  },

  mockFunctionValue: (hook, value) => {
    vi.mocked(hook).mockReturnValueOnce(value);
  },

  getMockArguments: (hook, callIndex) => {
    return vi.mocked(hook).mock.calls[callIndex];
  },
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('getSchema', () => {
  test('should provide form values to `getSchema`', () => {
    const getSchema = vi.fn();
    const getFieldSchema = () => null;
    const getFieldType = () => fieldType;

    const values: Record<string, any> = {
      field1: 'value1',
    };

    render({
      fieldSchema: {
        getSchema,
      },
      name: 'test',
      getFieldSchema,
      getFieldType,
    }, {
      useFormState: {
        values,
      } as FormState<Record<string, any>>,
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

  test.each([
    ['test', true],
    [null, false],
  ])('result of `getSchema` = %s, rendered = %s', (schema, isRendered) => {
    const engine = render({
      fieldSchema: {
        getSchema: () => schema,
      },
      name: 'test',
      getFieldSchema: () => null,
      getFieldType: () => fieldType,
    });

    expect(engine.checkIsRendered()).toBe(isRendered);
  });
});

describe('getFieldType', () => {
  test('should call `getFieldType` with correct argument', () => {
    const getFieldType = vi.fn()
      .mockReturnValue(fieldType);

    render({
      fieldSchema: {
        getSchema: () => 'test',
      },
      name: 'test',
      getFieldSchema: () => null,
      getFieldType,
    });

    expect(getFieldType).toHaveBeenCalledTimes(1);
    expect(getFieldType).toHaveBeenCalledWith('test');
  });
});

describe('render', () => {
  test('should provide correct props to rendered component', () => {
    const getFieldSchema = vi.fn();
    const getFieldType = vi.fn()
      .mockReturnValue(fieldType);

    const wrapper = render({
      fieldSchema: {
        getSchema: () => 'test',
      },
      name: 'testName',
      getFieldSchema,
      getFieldType,
    });

    const allProps = wrapper.accessors.field.getProps();

    expect(allProps.fieldSchema).toBe('test');
    expect(allProps.name).toBe('testName');
    expect(allProps.getFieldSchema).toBe(getFieldSchema);
    expect(allProps.getFieldType).toBe(getFieldType);
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
    unknown,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    unknown
    >>,
  ) {
    const refValue = {
      current: isFirstRender,
    };

    const engine = render(props, {
      useFormSchemaState: {
        isValuesReady,
      },
      useRef: refValue,
    });

    expect(useEffect).toBeCalledTimes(1);
    const effect = engine.getHookArguments('useEffect')[0];

    effect();

    return [refValue];
  }

  test('should not call `onShow` if values are not ready and not change `isFirstRender`', () => {
    const onShow = vi.fn();
    const onHide = vi.fn();

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
    const onShow = vi.fn();
    const onHide = vi.fn();

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
    const onShow = vi.fn();
    const onHide = vi.fn();

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
    const onShow = vi.fn();
    const onHide = vi.fn();

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
    const onShow = vi.fn();
    const onHide = vi.fn();

    const [{
      current: isFirstRender,
    }] = setupForCallbacks(true, false, {
      fieldSchema: {
        getSchema: () => 'schema',
        onShow,
        onHide,
      },
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
    const onShow = vi.fn();
    const onHide = vi.fn();

    const [{
      current: isFirstRender,
    }] = setupForCallbacks(true, false, {
      fieldSchema: {
        getSchema: () => null,
        onShow,
        onHide,
      },
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
