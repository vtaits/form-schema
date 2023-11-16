import { expect, test } from "vitest";

import { dynamic } from "./dynamic";
import * as lib from "./index";

test("correct exports", () => {
	expect(lib.dynamic).toBe(dynamic);
});
