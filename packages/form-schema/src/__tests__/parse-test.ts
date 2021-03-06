/* eslint-disable @typescript-eslint/no-explicit-any */

import parse from '../parse';
import {
  CreateGetFieldSchema,
  FieldType,
  GetFieldSchema,
  GetFieldType,
  Parser,
} from '../types';

type Values = Record<string, any>;

type ParserArgs = Parameters<Parser<any, any, any, any, any>>;

const fieldSchemas = {
  value: {
    type: 'testType',
  },

  value1: {
    type: 'testType1',
  },

  value2: {
    type: 'testType2',
  },
};

const defaultGetFieldSchema: GetFieldSchema<any> = (name: string) => fieldSchemas[name];

test('should return null for falsy values object', () => {
  expect(
    parse(
      null,
      [
        'value',
      ],
      defaultGetFieldSchema,
      (): FieldType<any, any, any, any, any> => ({}),
    ),
  ).toEqual(null);
});

test('should call default parser', () => {
  expect(
    parse(
      {
        value: 'test',
        value2: 'test2',
      },
      [
        'value',
      ],
      defaultGetFieldSchema,
      (): FieldType<any, any, any, any, any> => ({}),
    ),
  ).toEqual(
    {
      value: 'test',
    },
  );
});

test('should call default parser for empty value', () => {
  expect(
    parse(
      {
        value2: 'test2',
      },
      [
        'value',
      ],
      defaultGetFieldSchema,
      () => ({}),
    ),
  ).toEqual(
    {
      value: null,
    },
  );
});

test('should call redefined parser', () => {
  const rawValues: Values = {
    value: 'test',
    value2: 'test2',
  };

  const parser = jest.fn<any, ParserArgs>((values: Values, name: string): Values => ({
    [name]: values[name] + values[name],
  }));

  const getFieldType: GetFieldType<any, any, any, any, any> = () => ({
    parser,
  });

  expect(
    parse(
      rawValues,
      [
        'value',
      ],
      defaultGetFieldSchema,
      getFieldType,
    ),
  ).toEqual(
    {
      value: 'testtest',
    },
  );

  expect(parser.mock.calls.length).toBe(1);
  expect(parser.mock.calls[0][0]).toBe(rawValues);
  expect(parser.mock.calls[0][1]).toBe('value');
  expect(parser.mock.calls[0][2]).toBe(fieldSchemas.value);
  expect(parser.mock.calls[0][3]).toBe(defaultGetFieldSchema);
  expect(parser.mock.calls[0][4]).toBe(getFieldType);
});

test('should call multiple parsers', () => {
  const fields = {
    testType1: {},
    testType2: {
      parser: (values: Values, name: string): Values => ({
        [name]: values[name] + values[name],
      }),
    },
  };

  expect(
    parse(
      {
        value1: 'test1',
        value2: 'test2',
      },
      [
        'value1',
        'value2',
      ],
      defaultGetFieldSchema,
      ({ type }) => fields[type],
    ),
  ).toEqual(
    {
      value1: 'test1',
      value2: 'test2test2',
    },
  );
});

test('should redefine getFieldSchema', () => {
  const parser = jest.fn<any, ParserArgs>(() => ({}));

  const parentGetFieldSchema = jest.fn(() => ({
    type: 'testType',
    name: 'value',
  }));

  const getFieldSchema = jest.fn();

  const createGetFieldSchema = jest.fn<
  any,
  Parameters<CreateGetFieldSchema<any, any, any, any, any>>
  >(() => getFieldSchema);

  const getFieldType = jest.fn()
    .mockReturnValue({
      parser,
      createGetFieldSchema,
    });

  parse(
    {
      value: 'test',
    },

    [
      'value',
    ],

    parentGetFieldSchema,
    getFieldType,
  );

  expect(parser).toHaveBeenCalledTimes(1);
  expect(parser.mock.calls[0][3]).toBe(getFieldSchema);

  expect(createGetFieldSchema.mock.calls[0][1]).toBe(parentGetFieldSchema);
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
    'parse',
  );
});
