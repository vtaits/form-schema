/* eslint-disable @typescript-eslint/no-explicit-any */

import { validateBeforeSubmit } from '../validateBeforeSubmit';
import {
  CreateGetFieldSchema,
  GetFieldType,
  GetFieldSchema,
  FieldType,
  ValidatorBeforeSubmit,
} from '../types';

type Values = Record<string, any>;

type ValidatorBeforeSubmitArgs = Parameters<ValidatorBeforeSubmit<any, any, any, any, any>>;

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

  const validatorBeforeSubmit = jest.fn<any, ValidatorBeforeSubmitArgs>(
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
  );
});

test('should call multiple validators', () => {
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
    ),
  ).toEqual(
    {
      value1: 'test1',
      value2: 'test2test2',
    },
  );
});

test('should redefine getFieldSchema', () => {
  const validatorBeforeSubmit = jest.fn<any, ValidatorBeforeSubmitArgs>(() => ({}));

  const parentGetFieldSchema = jest.fn(() => ({
    type: 'testType',
    name: 'value',
  }));

  const getFieldSchema = jest.fn();

  const createGetFieldSchema = jest.fn<
  any,
  Parameters<CreateGetFieldSchema<any, any, any, any, any>>
  >()
    .mockReturnValue(getFieldSchema);

  const getFieldType = jest.fn()
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
  );
});
