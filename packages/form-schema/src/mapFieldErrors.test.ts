import { describe, expect, test, vi } from 'vitest';
import type {
  CreateGetFieldSchema,
  FieldType,
  GetFieldSchema,
  GetFieldType,
  ErrorsMapper,
} from './types';

import { defaultFieldErrorsMapper, mapFieldErrors } from './mapFieldErrors';

type Errors = Record<string, any>;
type Values = Record<string, any>;

type ErrorsMapperArgs = Parameters<ErrorsMapper<any, any, any, any, any>>;

const parents = [
  {
    values: {},
  },
];

describe('defaultFieldErrorsMapper', () => {
  test('get error by name', () => {
    expect(defaultFieldErrorsMapper(
      {
        foo: 'error1',
        bar: 'error2',
      },
      'foo',
      null,
      vi.fn(),
      vi.fn(),
      {},
      {},
      [],
    )).toEqual({
      foo: 'error1',
    });
  });

  test('return an empty object if there is no error by name', () => {
    expect(defaultFieldErrorsMapper(
      {
        bar: 'error2',
      },
      'foo',
      null,
      vi.fn(),
      vi.fn(),
      {},
      {},
      [],
    )).toEqual({});
  });
});

describe('mapFieldErrors', () => {
  test('should call default errors mapper', () => {
    expect(
      mapFieldErrors(
        {
          value: ['test'],
          value2: ['test2'],
        },
        [
          'value',
        ],
        (): any => ({
          type: 'testType',
          name: 'value',
        }),
        (): FieldType<any, any, any, any, any> => ({}),
        {},
        {},
        parents,
      ),
    ).toEqual(
      {
        value: ['test'],
        value2: ['test2'],
      },
    );
  });
  
  test('should call redefined errors mapper', () => {
    expect(
      mapFieldErrors(
        {
          value: ['test'],
          value2: ['test2'],
        },
        [
          'value',
        ],
        (): any => ({
          type: 'testType',
          name: 'value',
        }),
        () => ({
          errorsMapper: (errors: Errors, name: string): Errors => ({
            [name]: [errors[name][0] + errors[name][0]],
          }),
        }),
        {},
        {},
        parents,
      ),
    ).toEqual(
      {
        value: ['testtest'],
        value2: ['test2'],
      },
    );
  });
  
  test('should call multiple errors mappers', () => {
    const fields: Record<string, {
      type: string;
    }> = {
      value1: {
        type: 'testType1',
      },
      value2: {
        type: 'testType2',
      },
    };
  
    const fieldTypes: Record<string, FieldType<any, any, any, any, any>> = {
      testType1: {
        errorsMapper: (errors: Errors, name: string): Errors => ({
          [name]: [errors[name][0] + errors[name][0] + errors[name][0]],
        }),
      },
      testType2: {
        errorsMapper: (errors: Errors, name: string): Errors => ({
          [name]: [errors[name][0] + errors[name][0]],
        }),
      },
    };
  
    expect(
      mapFieldErrors(
        {
          value1: ['test1'],
          value2: ['test2'],
        },
        [
          'value1',
          'value2',
        ],
        (name): any => ({
          ...fields[name],
          name,
        }),
        ({ type }: { type: string }): FieldType<any, any, any, any, any> => fieldTypes[type],
        {},
        {},
        parents,
      ),
    ).toEqual(
      {
        value1: ['test1test1test1'],
        value2: ['test2test2'],
      },
    );
  });
  
  test('should call multiple nested errors mappers', () => {
    const fields: Record<string, {
      type: string;
      childNames: readonly string[];
      childs: Record<string, {
        type: string;
      }>;
    }> = {
      wrapper1: {
        type: 'wrapper',
        childNames: [
          'value1',
          'value2',
        ],
        childs: {
          value1: {
            type: 'testType1',
          },
          value2: {
            type: 'testType2',
          },
        },
      },
  
      wrapper2: {
        type: 'wrapper',
        childNames: [
          'value3',
          'value4',
        ],
        childs: {
          value3: {
            type: 'testType1',
          },
          value4: {
            type: 'testType2',
          },
        },
      },
    };
  
    const fieldTypes: Record<string, FieldType<any, any, any, any, any>> = {
      wrapper: {
        errorsMapper: (
          errors: Errors,
          name: string,
          {
            childNames,
            childs,
          }: any,
          getFieldSchema: GetFieldSchema<any>,
          getFieldType: GetFieldType<any, any, any, any, any>,
        ): Errors => mapFieldErrors(
          errors,
          childNames,
          (childName) => ({
            ...childs[childName],
            name: childName,
          }),
          getFieldType,
          {},
          {},
          parents,
        ),
      },
  
      testType1: {
        errorsMapper: (errors: Errors, name: string): Errors => ({
          [name]: [errors[name][0] + errors[name][0] + errors[name][0]],
        }),
      },
  
      testType2: {
        errorsMapper: (errors: Errors, name: string): Errors => ({
          [name]: [errors[name][0] + errors[name][0]],
        }),
      },
    };
  
    expect(
      mapFieldErrors(
        {
          value1: ['test1'],
          value2: ['test2'],
          value3: ['test3'],
          value4: ['test4'],
        },
  
        [
          'wrapper1',
          'wrapper2',
        ],
  
        (name: string): any => ({
          ...fields[name],
          name,
        }),
  
        ({ type }: { type: string }): FieldType<any, any, any, any, any> => fieldTypes[type],
  
        {},
        {},
        parents,
      ),
    ).toEqual(
      {
        value1: ['test1test1test1'],
        value2: ['test2test2'],
        value3: ['test3test3test3'],
        value4: ['test4test4'],
      },
    );
  });
  
  test('should provide correct arguments to errorsMapper', () => {
    const errorsMapper = vi.fn<ErrorsMapperArgs, any>((errors, name) => ({
      [name]: errors[name],
    }));
  
    const values: Values = {
      value: 'testValue',
    };
  
    const valuesRaw: Values = {
      value: 'testValueRaw',
    };
  
    const getFieldSchema: GetFieldSchema<any> = () => ({
      type: 'testType',
      name: 'value',
    });
  
    const getFieldType: GetFieldType<any, any, any, any, any> = () => ({
      errorsMapper,
    });
  
    mapFieldErrors(
      {
        value: 'test',
      },
      [
        'value',
      ],
      getFieldSchema,
      getFieldType,
      values,
      valuesRaw,
      parents,
    );
  
    expect(errorsMapper).toHaveBeenCalledTimes(1);
    expect(errorsMapper).toHaveBeenCalledWith(
      {
        value: 'test',
      },
      'value',
      {
        type: 'testType',
        name: 'value',
      },
      getFieldSchema,
      getFieldType,
      values,
      valuesRaw,
      parents,
    );
  });
  
  test('should redefine getFieldSchema', () => {
    const errorsMapper = vi.fn<ErrorsMapperArgs, any>(() => ({}));
  
    const parentGetFieldSchema = vi.fn(() => ({
      type: 'testType',
      name: 'value',
    }));
  
    const getFieldSchema = vi.fn();
  
    const createGetFieldSchema = vi.fn<
    Parameters<CreateGetFieldSchema<any, any, any, any, any>>,
    any
    >(() => getFieldSchema);
  
    const getFieldType = vi.fn()
      .mockReturnValue({
        errorsMapper,
        createGetFieldSchema,
      });
  
    mapFieldErrors(
      {
        value: 'error',
      },
  
      [
        'value',
      ],
  
      parentGetFieldSchema,
  
      getFieldType,
  
      {},
  
      {
        value: 'test',
      },
  
      parents,
    );
  
    expect(errorsMapper.mock.calls.length).toBe(1);
    expect(errorsMapper.mock.calls[0][3]).toBe(getFieldSchema);
  
    expect(createGetFieldSchema).toHaveBeenCalledTimes(1);
    expect(createGetFieldSchema).toHaveBeenCalledWith(
      {
        type: 'testType',
        name: 'value',
      },
      parentGetFieldSchema,
      getFieldType,
      {
        value: 'test',
      },
      'serialize',
      parents,
    );
  });
});
