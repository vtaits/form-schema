import { useFormState } from 'react-final-form';

import { checkValuesReady } from './checkValuesReady';

/**
 * If parsing if asynchronous it returns true only after end of parsing
 *
 * If parsing if synchronous it always returns true
 */
export const useValuesReady = (): boolean => {
  const {
    values,
  } = useFormState();

  return checkValuesReady(values);
};
