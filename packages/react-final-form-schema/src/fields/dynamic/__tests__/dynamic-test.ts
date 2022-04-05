import type {
  ParentType,
} from '@vtaits/form-schema';

import {
  createGetFieldSchema,
  dynamic,
} from '../dynamic';

const parents: ParentType[] = [
  {
    values: {},
  },
];

describe('createGetFieldSchema', () => {
  const getFieldSchema = jest.fn();
  const defaultGetFieldType = () => ({});

  test('should provide correct arguments to `getSchema`', () => {
    const getSchema = jest.fn();

    const values = {
      field1: 'value1',
    };

    createGetFieldSchema(
      { getSchema },
      getFieldSchema,
      defaultGetFieldType,
      values,
      'render',
      parents,
    );

    expect(getSchema).toHaveBeenCalledTimes(1);
    expect(getSchema).toHaveBeenCalledWith(
      values,
      'render',
      getFieldSchema,
      defaultGetFieldType,
      parents,
    );
  });

  test('should return parent `getFieldSchema` if `getSchema` returns falsy value', () => {
    const getSchema = jest.fn();

    const result = createGetFieldSchema(
      { getSchema },
      getFieldSchema,
      defaultGetFieldType,
      {},
      'render',
      parents,
    );

    expect(result).toBe(getFieldSchema);
  });

  test('should return parent `getFieldSchema` if type of field not contains `createGetFieldSchema`', () => {
    const result = createGetFieldSchema(
      {
        getSchema: () => ({}),
      },
      getFieldSchema,
      defaultGetFieldType,
      {},
      'render',
      parents,
    );

    expect(result).toBe(getFieldSchema);
  });

  test('should return parent `getFieldSchema` if type of field not contains `createGetFieldSchema`', () => {
    const childGetFieldSchema = jest.fn();

    const childCreateGetFieldSchema = jest.fn()
      .mockReturnValue(childGetFieldSchema);

    const getFeldType = jest.fn()
      .mockReturnValue({
        createGetFieldSchema: childCreateGetFieldSchema,
      });

    const testSchema = {
      type: 'testType',
    };

    const values = {
      field1: 'value1',
    };

    const result = createGetFieldSchema(
      {
        getSchema: () => testSchema,
      },
      getFieldSchema,
      getFeldType,
      values,
      'render',
      parents,
    );

    expect(result).toBe(childGetFieldSchema);

    expect(childCreateGetFieldSchema).toHaveBeenCalledTimes(1);
    expect(childCreateGetFieldSchema).toHaveBeenCalledWith(
      testSchema,
      getFieldSchema,
      getFeldType,
      values,
      'render',
      parents,
    );
  });
});

describe('serializer', () => {
  const getFieldSchema = jest.fn();
  const defaultGetFieldType = jest.fn();

  test('should provide all values to `getSchema`', () => {
    const getSchema = jest.fn();

    const values = {
      field1: 'value1',
    };

    dynamic.serializer(
      values,
      'test',
      { getSchema },
      getFieldSchema,
      defaultGetFieldType,
      parents,
    );

    expect(getSchema).toHaveBeenCalledTimes(1);
    expect(getSchema).toHaveBeenCalledWith(
      values,
      'serialize',
      getFieldSchema,
      defaultGetFieldType,
      parents,
    );
  });

  test('should return empty object if `getSchema` returns falsy value', () => {
    const values = {
      field1: 'value1',
    };

    const result = dynamic.serializer(
      values,
      'test',
      {
        getSchema: () => null,
      },
      getFieldSchema,
      defaultGetFieldType,
      parents,
    );

    expect(result).toEqual({});
  });

  test('should call `getFieldType` with correct argument', () => {
    const getFieldType = jest.fn()
      .mockReturnValue({});

    const values = {
      field1: 'value1',
    };

    dynamic.serializer(
      values,
      'test',
      {
        getSchema: () => 'testSchema',
      },
      getFieldSchema,
      getFieldType,
      parents,
    );

    expect(getFieldType).toHaveBeenCalledTimes(1);
    expect(getFieldType).toHaveBeenCalledWith('testSchema');
  });

  test('should call serializer of computed field type if defined', () => {
    const serializer = jest.fn()
      .mockReturnValue({
        field1: 'serialized1',
      });

    const getFieldType = jest.fn()
      .mockReturnValue({
        serializer,
      });

    const values = {
      field1: 'value1',
    };

    const result = dynamic.serializer(
      values,
      'test',
      {
        getSchema: () => 'testSchema',
      },
      getFieldSchema,
      getFieldType,
      parents,
    );

    expect(result).toEqual({
      field1: 'serialized1',
    });

    expect(serializer).toHaveBeenCalledWith(
      values,
      'test',
      'testSchema',
      getFieldSchema,
      getFieldType,
      parents,
    );
  });

  test('should call default serializer for computed field', () => {
    const getFieldType = jest.fn()
      .mockReturnValue({});

    const values = {
      field1: 'value1',
      field2: 'value2',
    };

    const result = dynamic.serializer(
      values,
      'field1',
      {
        getSchema: () => 'testSchema',
      },
      getFieldSchema,
      getFieldType,
      parents,
    );

    expect(result).toEqual({
      field1: 'value1',
    });
  });
});

describe('parser', () => {
  const getFieldSchema = jest.fn();
  const defaultGetFieldType = jest.fn();

  describe('getSchema', () => {
    test('should provide all values to `getSchema`', () => {
      const getSchema = jest.fn();

      const values = {
        field1: 'value1',
      };

      dynamic.parser(
        values,
        'test',
        { getSchema },
        getFieldSchema,
        defaultGetFieldType,
        parents,
      );

      expect(getSchema).toHaveBeenCalledTimes(1);
      expect(getSchema).toHaveBeenCalledWith(
        values,
        'parse',
        getFieldSchema,
        defaultGetFieldType,
        parents,
      );
    });

    test('should return empty object if `getSchema` returns falsy value', () => {
      const values = {
        field1: 'value1',
      };

      const result = dynamic.parser(
        values,
        'test',
        {
          getSchema: () => null,
        },
        getFieldSchema,
        defaultGetFieldType,
        parents,
      );

      expect(result).toEqual({});
    });

    test('should call `getFieldType` with correct argument', () => {
      const getFieldType = jest.fn()
        .mockReturnValue({});

      const values = {
        field1: 'value1',
      };

      dynamic.parser(
        values,
        'test',
        {
          getSchema: () => 'testSchema',
        },
        getFieldSchema,
        getFieldType,
        parents,
      );

      expect(getFieldType).toHaveBeenCalledTimes(1);
      expect(getFieldType).toHaveBeenCalledWith('testSchema');
    });

    test('should call parser of computed field type if defined', () => {
      const parser = jest.fn()
        .mockReturnValue({
          field1: 'parsed1',
        });

      const getFieldType = jest.fn()
        .mockReturnValue({
          parser,
        });

      const values = {
        field1: 'value1',
      };

      const result = dynamic.parser(
        values,
        'test',
        {
          getSchema: () => 'testSchema',
        },
        getFieldSchema,
        getFieldType,
        parents,
      );

      expect(result).toEqual({
        field1: 'parsed1',
      });

      expect(parser).toHaveBeenCalledWith(
        values,
        'test',
        'testSchema',
        getFieldSchema,
        getFieldType,
        parents,
      );
    });

    test('should call default parser for computed field', () => {
      const getFieldType = jest.fn()
        .mockReturnValue({});

      const values = {
        field1: 'value1',
        field2: 'value2',
      };

      const result = dynamic.parser(
        values,
        'field1',
        {
          getSchema: () => 'testSchema',
        },
        getFieldSchema,
        getFieldType,
        parents,
      );

      expect(result).toEqual({
        field1: 'value1',
      });
    });
  });

  describe('getSchemaAsync', () => {
    test('should provide all values to `getSchemaAsync`', async () => {
      const getSchema = jest.fn();
      const getSchemaAsync = jest.fn()
        .mockResolvedValue(null);

      const values = {
        field1: 'value1',
      };

      await dynamic.parser(
        values,
        'test',
        {
          getSchemaAsync,
          getSchema,
        },
        getFieldSchema,
        defaultGetFieldType,
        parents,
      );

      expect(getSchemaAsync).toHaveBeenCalledTimes(1);
      expect(getSchemaAsync).toHaveBeenCalledWith(
        values,
        'parse',
        getFieldSchema,
        defaultGetFieldType,
        parents,
      );

      expect(getSchema).toHaveBeenCalledTimes(0);
    });

    test('should return empty object if `getSchemaAsync` returns falsy value', async () => {
      const getSchema = jest.fn()
        .mockReturnValue('testSchemaSync');
      const getSchemaAsync = jest.fn()
        .mockResolvedValue(null);

      const values = {
        field1: 'value1',
      };

      const result = await dynamic.parser(
        values,
        'test',
        {
          getSchemaAsync,
          getSchema,
        },
        getFieldSchema,
        defaultGetFieldType,
        parents,
      );

      expect(result).toEqual({});
    });

    test('should call `getFieldType` with correct argument', async () => {
      const getSchema = jest.fn()
        .mockReturnValue('testSchemaSync');
      const getSchemaAsync = jest.fn()
        .mockResolvedValue('testSchema');

      const getFieldType = jest.fn()
        .mockReturnValue({});

      const values = {
        field1: 'value1',
      };

      await dynamic.parser(
        values,
        'test',
        {
          getSchemaAsync,
          getSchema,
        },
        getFieldSchema,
        getFieldType,
        parents,
      );

      expect(getFieldType).toHaveBeenCalledTimes(1);
      expect(getFieldType).toHaveBeenCalledWith('testSchema');
    });

    test('should call parser of computed field type if defined', async () => {
      const getSchema = jest.fn()
        .mockReturnValue('testSchemaSync');
      const getSchemaAsync = jest.fn()
        .mockResolvedValue('testSchema');

      const parser = jest.fn()
        .mockReturnValue({
          field1: 'parsed1',
        });

      const getFieldType = jest.fn()
        .mockReturnValue({
          parser,
        });

      const values = {
        field1: 'value1',
      };

      const result = await dynamic.parser(
        values,
        'test',
        {
          getSchemaAsync,
          getSchema,
        },
        getFieldSchema,
        getFieldType,
        parents,
      );

      expect(result).toEqual({
        field1: 'parsed1',
      });

      expect(parser).toHaveBeenCalledWith(
        values,
        'test',
        'testSchema',
        getFieldSchema,
        getFieldType,
        parents,
      );
    });

    test('should call default parser for computed field', async () => {
      const getSchema = jest.fn()
        .mockReturnValue('testSchemaSync');
      const getSchemaAsync = jest.fn()
        .mockResolvedValue('testSchema');

      const getFieldType = jest.fn()
        .mockReturnValue({});

      const values = {
        field1: 'value1',
        field2: 'value2',
      };

      const result = await dynamic.parser(
        values,
        'field1',
        {
          getSchemaAsync,
          getSchema,
        },
        getFieldSchema,
        getFieldType,
        parents,
      );

      expect(getFieldType).toHaveBeenCalledTimes(1);
      expect(getFieldType).toHaveBeenCalledWith('testSchema');

      expect(result).toEqual({
        field1: 'value1',
      });
    });
  });
});

describe('validatorBeforeSubmit', () => {
  const getFieldSchema = jest.fn();
  const defaultGetFieldType = jest.fn();

  test('should provide all values to `getSchema`', () => {
    const getSchema = jest.fn();

    const values = {
      field1: 'value1',
    };

    dynamic.validatorBeforeSubmit(
      values,
      'test',
      { getSchema },
      getFieldSchema,
      defaultGetFieldType,
      parents,
    );

    expect(getSchema).toHaveBeenCalledTimes(1);
    expect(getSchema).toHaveBeenCalledWith(
      values,
      'serialize',
      getFieldSchema,
      defaultGetFieldType,
      parents,
    );
  });

  test('should return empty object if `getSchema` returns falsy value', () => {
    const values = {
      field1: 'value1',
    };

    const result = dynamic.validatorBeforeSubmit(
      values,
      'test',
      {
        getSchema: () => null,
      },
      getFieldSchema,
      defaultGetFieldType,
      parents,
    );

    expect(result).toEqual({});
  });

  test('should call `getFieldType` with correct argument', () => {
    const getFieldType = jest.fn()
      .mockReturnValue({});

    const values = {
      field1: 'value1',
    };

    dynamic.validatorBeforeSubmit(
      values,
      'test',
      {
        getSchema: () => 'testSchema',
      },
      getFieldSchema,
      getFieldType,
      parents,
    );

    expect(getFieldType).toHaveBeenCalledTimes(1);
    expect(getFieldType).toHaveBeenCalledWith('testSchema');
  });

  test('should call validatorBeforeSubmit of computed field type if defined', () => {
    const validatorBeforeSubmit = jest.fn()
      .mockReturnValue({
        field1: 'serialized1',
      });

    const getFieldType = jest.fn()
      .mockReturnValue({
        validatorBeforeSubmit,
      });

    const values = {
      field1: 'value1',
    };

    const result = dynamic.validatorBeforeSubmit(
      values,
      'test',
      {
        getSchema: () => 'testSchema',
      },
      getFieldSchema,
      getFieldType,
      parents,
    );

    expect(result).toEqual({
      field1: 'serialized1',
    });

    expect(validatorBeforeSubmit).toHaveBeenCalledWith(
      values,
      'test',
      'testSchema',
      getFieldSchema,
      getFieldType,
      parents,
    );
  });

  test('should return empty object if validatorBeforeSubmit for computed field is not defined', () => {
    const getFieldType = jest.fn()
      .mockReturnValue({});

    const values = {
      field1: 'value1',
      field2: 'value2',
    };

    const result = dynamic.validatorBeforeSubmit(
      values,
      'field1',
      {
        getSchema: () => 'testSchema',
      },
      getFieldSchema,
      getFieldType,
      parents,
    );

    expect(result).toEqual({});
  });
});

describe('errorsMapper', () => {
  const getFieldSchema = jest.fn();
  const defaultGetFieldType = jest.fn();

  const values = {
    field1: 'value1',
  };

  const rawValues = {
    field1: 'rawValue1',
  };

  test('should provide all errors to `getSchema`', () => {
    const getSchema = jest.fn();

    const errors = {
      field1: 'error1',
    };

    dynamic.errorsMapper(
      errors,
      'test',
      { getSchema },
      getFieldSchema,
      defaultGetFieldType,
      values,
      rawValues,
      parents,
    );

    expect(getSchema).toHaveBeenCalledTimes(1);
    expect(getSchema).toHaveBeenCalledWith(
      rawValues,
      'serialize',
      getFieldSchema,
      defaultGetFieldType,
      parents,
    );
  });

  test('should return empty object if `getSchema` returns falsy value', () => {
    const errors = {
      field1: 'error1',
    };

    const result = dynamic.errorsMapper(
      errors,
      'test',
      {
        getSchema: () => null,
      },
      getFieldSchema,
      defaultGetFieldType,
      values,
      rawValues,
      parents,
    );

    expect(result).toEqual({});
  });

  test('should call `getFieldType` with correct argument', () => {
    const getFieldType = jest.fn()
      .mockReturnValue({});

    const errors = {
      field1: 'error1',
    };

    dynamic.errorsMapper(
      errors,
      'test',
      {
        getSchema: () => 'testSchema',
      },
      getFieldSchema,
      getFieldType,
      values,
      rawValues,
      parents,
    );

    expect(getFieldType).toHaveBeenCalledTimes(1);
    expect(getFieldType).toHaveBeenCalledWith('testSchema');
  });

  test('should call errorsMapper of computed field type if defined', () => {
    const errorsMapper = jest.fn()
      .mockReturnValue({
        field1: 'processed1',
      });

    const getFieldType = jest.fn()
      .mockReturnValue({
        errorsMapper,
      });

    const errors = {
      field1: 'error1',
    };

    const result = dynamic.errorsMapper(
      errors,
      'test',
      {
        getSchema: () => 'testSchema',
      },
      getFieldSchema,
      getFieldType,
      values,
      rawValues,
      parents,
    );

    expect(result).toEqual({
      field1: 'processed1',
    });

    expect(errorsMapper).toHaveBeenCalledWith(
      errors,
      'test',
      'testSchema',
      getFieldSchema,
      getFieldType,
      values,
      rawValues,
      parents,
    );
  });

  test('should call default errorsMapper for computed field', () => {
    const getFieldType = jest.fn()
      .mockReturnValue({});

    const errors = {
      field1: 'error1',
      field2: 'error2',
    };

    const result = dynamic.errorsMapper(
      errors,
      'field1',
      {
        getSchema: () => 'testSchema',
      },
      getFieldSchema,
      getFieldType,
      values,
      rawValues,
      parents,
    );

    expect(result).toEqual({
      field1: 'error1',
    });
  });
});
