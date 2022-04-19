import * as finalFormMocks from 'react-final-form';

import { useValuesReady } from '../useValuesReady';

import * as checkValuesReadyMocks from '../checkValuesReady';

jest.mock('react-final-form');
jest.mock('../checkValuesReady');

(finalFormMocks.useFormState as jest.Mock).mockReturnValue({
  values: {
    test: 'testValue',
  },
});

afterEach(() => {
  jest.clearAllMocks();
});

test('should return `true` if `checkValuesReady` returns `true`', () => {
  (checkValuesReadyMocks.checkValuesReady as jest.Mock).mockReturnValue(true);

  expect(useValuesReady()).toBe(true);
});

test('should return `false` if `checkValuesReady` returns `false`', () => {
  (checkValuesReadyMocks.checkValuesReady as jest.Mock).mockReturnValue(false);

  expect(useValuesReady()).toBe(false);
});

test('should call `checkValuesReady` with values of `useFormState`', () => {
  useValuesReady();

  expect(checkValuesReadyMocks.checkValuesReady).toHaveBeenCalledTimes(1);
  expect(checkValuesReadyMocks.checkValuesReady).toHaveBeenCalledWith(
    {
      test: 'testValue',
    },
  );
});
