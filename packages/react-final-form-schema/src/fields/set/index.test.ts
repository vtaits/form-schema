import { expect, test } from "vitest";

import * as lib from "./index";
import { set } from "./set";

test("correct exports", () => {
	expect(lib.set).toBe(set);
});
