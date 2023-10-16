import { expect, test, vi } from "vitest";

import { useFormSchemaState } from "./useFormSchemaState";
import { useValuesReady } from "./useValuesReady";

vi.mock("./useValuesReady");

test.each([[true], [false]])("values ready = %s", (isValuesReady) => {
	vi.mocked(useValuesReady).mockReturnValue(isValuesReady);

	expect(useFormSchemaState()).toEqual({
		isValuesReady,
	});
});
