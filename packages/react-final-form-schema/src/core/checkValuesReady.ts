/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IS_VALUES_READY_NAME,
} from './constants';

/**
 * If parsing if asynchronous it returns true only after end of parsing
 *
 * If parsing if synchronous it always returns true
 *
 * @param {Values extends Record<string, any>} formValues Current values of `final-form`
 */
export const checkValuesReady = <
Values extends Record<string, any>,
>(formValues: Values): boolean => {
  if (!formValues) {
    return false;
  }

  return Boolean(formValues[IS_VALUES_READY_NAME]);
};
