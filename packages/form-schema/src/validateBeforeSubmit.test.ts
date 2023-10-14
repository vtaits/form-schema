import { expect, test, vi } from 'vitest';

import { validateBeforeSubmit } from './validateBeforeSubmit';
import type {
  CreateGetFieldSchema,
  GetFieldType,
  GetFieldSchema,
  FieldType,
  ValidatorBeforeSubmit,
} from './types';

type Values = Record<string, any>;

type ValidatorBeforeSubmitArgs = Parameters<ValidatorBeforeSubmit<any, any, any, any, any>>;

const parents = [
  {
    values: {},
  },
];

test('should call default validatorBeforeSubmit', () => {
  expect(
    validateBeforeSubmit(
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

      parents,
    ),
  ).toEqual(
    {},
  );
});

test('should call redefined validatorBeforeSubmit', () => {
  const rawValues = {
    value: 'test',
    value2: 'test2',
  };

  const validatorBeforeSubmit = vi.fn<ValidatorBeforeSubmitArgs, any>(
    (values: Values, name: string): Values => ({
      [name]: values[name] + values[name],
    }),
  );

  const getFieldType: GetFieldType<any, any, any, any, any> = () => ({
    validatorBeforeSubmit,
  });

  const fieldSchema = {
    type: 'testType',
    name: 'value',
  };

  const getFieldSchema: GetFieldSchema<any> = () => fieldSchema;

  expect(
    validateBeforeSubmit(
      rawValues,

      [
        'value',
      ],

      getFieldSchema,
      getFieldType,
      parents,
    ),
  ).toEqual(
    {
      value: 'testtest',
    },
  );

  expect(validatorBeforeSubmit).toHaveBeenCalledTimes(1);
  expect(validatorBeforeSubmit).toHaveBeenCalledWith(
    rawValues,
    'value',
    fieldSchema,
    getFieldSchema,
    getFieldType,
    parents,
  );
});

test('should call multiple validators', () => {
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
      validatorBeforeSubmit: (values: Values, name: string): Values => ({
        [name]: values[name],
      }),
    },
    testType2: {
      validatorBeforeSubmit: (values: Values, name: string): Values => ({
        [name]: values[name] + values[name],
      }),
    },
  };

  expect(
    validateBeforeSubmit(
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

      parents,
    ),
  ).toEqual(
    {
      value1: 'test1',
      value2: 'test2test2',
    },
  );
});

test('should redefine getFieldSchema', () => {
  const validatorBeforeSubmit = vi.fn<ValidatorBeforeSubmitArgs, any>(() => ({}));

  const parentGetFieldSchema = vi.fn(() => ({
    type: 'testType',
    name: 'value',
  }));

  const getFieldSchema = vi.fn();

  const createGetFieldSchema = vi.fn<
  Parameters<CreateGetFieldSchema<any, any, any, any, any>>,
  any
  >()
    .mockReturnValue(getFieldSchema);

  const getFieldType = vi.fn()
    .mockReturnValue({
      validatorBeforeSubmit,
      createGetFieldSchema,
    });

  validateBeforeSubmit(
    {
      value: 'test',
    },

    [
      'value',
    ],

    parentGetFieldSchema,
    getFieldType,
    parents,
  );

  expect(validatorBeforeSubmit).toHaveBeenCalledTimes(1);
  expect(validatorBeforeSubmit.mock.calls[0][3]).toBe(getFieldSchema);

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
