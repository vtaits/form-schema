/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Errors,
  FieldType,
  GetFieldSchema,
  GetFieldType,
  Values,
} from '../types';

import mapFieldErrors from '../mapFieldErrors';

type ErrorsMapperArgs = [
  Errors,
  string,
  any,
  GetFieldSchema,
  GetFieldType,
  Values,
  Values,
];

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
      (): FieldType => ({}),
      {},
      {},
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
    ),
  ).toEqual(
    {
      value: ['testtest'],
      value2: ['test2'],
    },
  );
});

test('should call multiple errors mappers', () => {
  const fields = {
    value1: {
      type: 'testType1',
    },
    value2: {
      type: 'testType2',
    },
  };

  const fieldTypes = {
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
      ({ type }: { type: string }): FieldType => fieldTypes[type],
      {},
      {},
    ),
  ).toEqual(
    {
      value1: ['test1test1test1'],
      value2: ['test2test2'],
    },
  );
});

test('should call multiple nested errors mappers', () => {
  const fields = {
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

  const fieldTypes: Record<string, FieldType> = {
    wrapper: {
      errorsMapper: (
        errors: Errors,
        name: string,
        {
          childNames,
          childs,
        }: any,
        getFieldSchema: GetFieldSchema,
        getFieldType: GetFieldType,
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

      ({ type }: { type: string }): FieldType => fieldTypes[type],

      {},
      {},
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
  const errorsMapper = jest.fn<any, ErrorsMapperArgs>((errors, name) => ({
    [name]: errors[name],
  }));

  const values: Values = {
    value: 'testValue',
  };

  const valuesRaw: Values = {
    value: 'testValueRaw',
  };

  const getFieldSchema: GetFieldSchema = () => ({
    type: 'testType',
    name: 'value',
  });

  const getFieldType: GetFieldType = () => ({
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
  );

  expect(errorsMapper.mock.calls.length).toBe(1);
  expect(errorsMapper.mock.calls[0][0]).toEqual({
    value: 'test',
  });
  expect(errorsMapper.mock.calls[0][1]).toBe('value');
  expect(errorsMapper.mock.calls[0][2]).toEqual({
    type: 'testType',
    name: 'value',
  });
  expect(errorsMapper.mock.calls[0][3]).toBe(getFieldSchema);
  expect(errorsMapper.mock.calls[0][4]).toBe(getFieldType);
  expect(errorsMapper.mock.calls[0][5]).toBe(values);
  expect(errorsMapper.mock.calls[0][6]).toBe(valuesRaw);
});

test('should redefine getFieldSchema', () => {
  const errorsMapper = jest.fn<any, ErrorsMapperArgs>(() => ({}));
  const parentGetFieldSchema = jest.fn(() => ({
    type: 'testType',
    name: 'value',
  }));
  const getFieldSchema = jest.fn();
  const createGetFieldSchema = jest.fn<any, [
    any,
    GetFieldSchema,
  ]>(() => getFieldSchema);

  mapFieldErrors(
    {
      value: 'test',
    },

    [
      'value',
    ],

    parentGetFieldSchema,

    () => ({
      errorsMapper,

      createGetFieldSchema,
    }),

    {},
    {},
  );

  expect(errorsMapper.mock.calls.length).toBe(1);
  expect(errorsMapper.mock.calls[0][3]).toBe(getFieldSchema);

  expect(createGetFieldSchema.mock.calls.length).toBe(1);
  expect(createGetFieldSchema.mock.calls[0][0]).toEqual({
    type: 'testType',
    name: 'value',
  });
  expect(createGetFieldSchema.mock.calls[0][1]).toBe(parentGetFieldSchema);
});
