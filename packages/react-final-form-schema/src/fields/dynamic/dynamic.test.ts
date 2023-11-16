import { expect, test } from "vitest";

import { DynamicField } from "./component";
import { dynamic } from "./dynamic";

test("provide correct component", () => {
	expect(dynamic.component).toBe(DynamicField);
});
