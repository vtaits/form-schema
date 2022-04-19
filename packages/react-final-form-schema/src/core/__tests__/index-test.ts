import * as lib from '../index';

import { checkValuesReady } from '../checkValuesReady';
import { Form } from '../Form';
import { useFormSchemaState } from '../useFormSchemaState';
import { useValuesReady } from '../useValuesReady';

test('should export needed modules', () => {
  expect(lib.checkValuesReady).toBe(checkValuesReady);
  expect(lib.checkValuesReady).toBeTruthy();

  expect(lib.Form).toBe(Form);
  expect(lib.Form).toBeTruthy();

  expect(lib.useFormSchemaState).toBe(useFormSchemaState);
  expect(lib.useFormSchemaState).toBeTruthy();

  expect(lib.useValuesReady).toBe(useValuesReady);
  expect(lib.useValuesReady).toBeTruthy();
});
