import serialize from '../serialize';

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

      () => ({
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
  expect(
    serialize(
      {
        value: 'test',
        value2: 'test2',
      },

      [
        'value',
      ],

      () => ({
        type: 'testType',
        name: 'value',
      }),

      () => ({
        serializer: (values, { name }) => ({
          [name]: values[name] + values[name],
        }),
      }),
    ),
  ).toEqual(
    {
      value: 'testtest',
    },
  );
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
      serializer: (values, { name }) => ({
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

      (name) => ({
        ...fields[name],
        name,
      }),

      ({ type }) => fieldTypes[type],
    ),
  ).toEqual(
    {
      value1: 'test1',
      value2: 'test2test2',
    },
  );
});

test('should redefine getFieldSchema', () => {
  const serializer = jest.fn(() => ({}));
  const parentGetFieldSchema = jest.fn(() => ({
    type: 'testType',
    name: 'value',
  }));
  const getFieldSchema = jest.fn();
  const createGetFieldSchema = jest.fn(() => getFieldSchema);

  serialize(
    {
      value: 'test',
    },

    [
      'value',
    ],

    parentGetFieldSchema,

    () => ({
      serializer,

      createGetFieldSchema,
    }),
  );

  expect(serializer.mock.calls.length).toBe(1);
  expect(serializer.mock.calls[0][2]).toBe(getFieldSchema);

  expect(createGetFieldSchema.mock.calls.length).toBe(1);
  expect(createGetFieldSchema.mock.calls[0][0]).toEqual({
    type: 'testType',
    name: 'value',
  });
  expect(createGetFieldSchema.mock.calls[0][1]).toBe(parentGetFieldSchema);
});
