import { expect, test } from "vitest";

import { BaseUIContext } from "./BaseUIContext";
import * as lib from "./index";
import { useUI } from "./useUI";

test("should export needed modules", () => {
	expect(lib.BaseUIContext).toBe(BaseUIContext);
	expect(lib.BaseUIContext).toBeTruthy();

	expect(lib.useUI).toBe(useUI);
	expect(lib.useUI).toBeTruthy();
});
