import * as lib from '../index';

import { Form } from '../Form';

test('should export needed modules', () => {
  expect(lib.Form).toBe(Form);
  expect(lib.Form).toBeTruthy();
});
