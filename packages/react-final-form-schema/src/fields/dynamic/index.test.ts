import { expect, test } from 'vitest';

import * as lib from './index';
import { dynamic } from './dynamic';

test('correct exports', () => {
  expect(lib.dynamic).toBe(dynamic);
});

