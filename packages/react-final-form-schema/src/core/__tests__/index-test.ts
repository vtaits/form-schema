import * as lib from '../index';

import { Form } from '../Form';
import { useFormSchemaState } from '../useFormSchemaState';

test('should export needed modules', () => {
  expect(lib.Form).toBe(Form);
  expect(lib.Form).toBeTruthy();

  expect(lib.useFormSchemaState).toBe(useFormSchemaState);
  expect(lib.useFormSchemaState).toBeTruthy();
});
