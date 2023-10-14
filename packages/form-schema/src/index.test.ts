import { expect, test } from 'vitest';

import * as formSchamaLib from './index';
import { serialize, defaultSerializer } from './serialize';
import { parse, defaultParser } from './parse';
import { mapFieldErrors, defaultFieldErrorsMapper } from './mapFieldErrors';
import { validateBeforeSubmit } from './validateBeforeSubmit';

test('should export needed modules', () => {
  expect(formSchamaLib.serialize).toBe(serialize);
  expect(formSchamaLib.serialize).toBeTruthy();

  expect(formSchamaLib.defaultSerializer).toBe(defaultSerializer);
  expect(formSchamaLib.defaultSerializer).toBeTruthy();

  expect(formSchamaLib.parse).toBe(parse);
  expect(formSchamaLib.parse).toBeTruthy();

  expect(formSchamaLib.defaultParser).toBe(defaultParser);
  expect(formSchamaLib.defaultParser).toBeTruthy();

  expect(formSchamaLib.validateBeforeSubmit).toBe(validateBeforeSubmit);
  expect(formSchamaLib.validateBeforeSubmit).toBeTruthy();

  expect(formSchamaLib.mapFieldErrors).toBe(mapFieldErrors);
  expect(formSchamaLib.mapFieldErrors).toBeTruthy();

  expect(formSchamaLib.defaultFieldErrorsMapper).toBe(defaultFieldErrorsMapper);
  expect(formSchamaLib.defaultFieldErrorsMapper).toBeTruthy();
});
