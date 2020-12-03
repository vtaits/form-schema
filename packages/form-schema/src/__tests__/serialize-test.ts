/* eslint-disable @typescript-eslint/no-explicit-any */

import serialize from '../serialize';
import {
  GetFieldType,
  GetFieldSchema,
  FieldType,
  Serializer,
} from '../types';

type Values = Record<string, any>;

type SerializerArgs = Parameters<Serializer<any, any, any, any, any>>;

test('should call default serializer', () => {
  expect(
    serialize(
      {
        value: 'test',
        value2: 'test2',
      },

      [
        'value',
      ],

      (): any => ({
        type: 'testType',
        name: 'value',
      }),

      () => ({}),
    ),
  ).toEqual(
    {
      value: 'test',
    },
  );
});

test('should call redefined serializer', () => {
  const rawValues = {
    value: 'test',
    value2: 'test2',
  };

  const serializer = jest.fn<any, SerializerArgs>((values: Values, name: string): Values => ({
    [name]: values[name] + values[name],
  }));

  const getFieldType: GetFieldType<any, any, any, any, any> = () => ({
    serializer,
  });

  const fieldSchema = {
    type: 'testType',
    name: 'value',
  };

  const getFieldSchema: GetFieldSchema<any> = () => fieldSchema;

  expect(
    serialize(
      rawValues,

      [
        'value',
      ],

      getFieldSchema,
      getFieldType,
    ),
  ).toEqual(
    {
      value: 'testtest',
    },
  );

  expect(serializer.mock.calls.length).toBe(1);
  expect(serializer.mock.calls[0][0]).toBe(rawValues);
  expect(serializer.mock.calls[0][1]).toBe('value');
  expect(serializer.mock.calls[0][2]).toBe(fieldSchema);
  expect(serializer.mock.calls[0][3]).toBe(getFieldSchema);
  expect(serializer.mock.calls[0][4]).toBe(getFieldType);
});

test('should call multiple serializers', () => {
  const fields = {
    value1: {
      type: 'testType1',
    },
    value2: {
      type: 'testType2',
    },
  };

  const fieldTypes = {
    testType1: {},
    testType2: {
      serializer: (values: Values, name: string): Values => ({
        [name]: values[name] + values[name],
      }),
    },
  };

  expect(
    serialize(
      {
        value1: 'test1',
        value2: 'test2',
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
    ),
  ).toEqual(
    {
      value1: 'test1',
      value2: 'test2test2',
    },
  );
});

test('should redefine getFieldSchema', () => {
  const serializer = jest.fn<any, SerializerArgs>(() => ({}));
  const parentGetFieldSchema = jest.fn(() => ({
    type: 'testType',
    name: 'value',
  }));
  const getFieldSchema = jest.fn();
  const createGetFieldSchema = jest.fn<any, [
    any,
    GetFieldSchema<any>,
  ]>(() => getFieldSchema);

  serialize(
    {
      value: 'test',
    },

    [
      'value',
    ],

    parentGetFieldSchema,

    (): FieldType<any, any, any, any, any> => ({
      serializer,

      createGetFieldSchema,
    }),
  );

  expect(serializer.mock.calls.length).toBe(1);
  expect(serializer.mock.calls[0][3]).toBe(getFieldSchema);

  expect(createGetFieldSchema.mock.calls.length).toBe(1);
  expect(createGetFieldSchema.mock.calls[0][0]).toEqual({
    type: 'testType',
    name: 'value',
  });
  expect(createGetFieldSchema.mock.calls[0][1]).toBe(parentGetFieldSchema);
});
