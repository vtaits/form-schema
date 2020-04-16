import * as formSchamaLib from '../index';

import serialize from '../serialize';
import parse from '../parse';
import mapFieldErrors from '../mapFieldErrors';

test('should export needed modules', () => {
  expect(formSchamaLib.serialize).toBe(serialize);
  expect(formSchamaLib.serialize).toBeTruthy();

  expect(formSchamaLib.parse).toBe(parse);
  expect(formSchamaLib.parse).toBeTruthy();

  expect(formSchamaLib.mapFieldErrors).toBe(mapFieldErrors);
  expect(formSchamaLib.mapFieldErrors).toBeTruthy();
});
