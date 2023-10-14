import { test, expect } from 'vitest';

import {
  IS_VALUES_READY_NAME,
} from './constants';

import { checkValuesReady } from './checkValuesReady';

test('should return `false` for falsy values', () => {
  expect(checkValuesReady(null)).toBe(false);
});

test('should return `false` if flag is falsy', () => {
  expect(checkValuesReady({
    [IS_VALUES_READY_NAME]: false,
  })).toBe(false);
});

test('should return `false` if flag is truthy', () => {
  expect(checkValuesReady({
    [IS_VALUES_READY_NAME]: true,
  })).toBe(true);
});
