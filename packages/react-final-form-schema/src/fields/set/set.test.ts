import { expect, test } from "vitest";

import { SetField } from "./component";
import { set } from "./set";

test("provide correct component", () => {
	expect(set.component).toBe(SetField);
});
