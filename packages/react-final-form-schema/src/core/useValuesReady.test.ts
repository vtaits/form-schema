import { useFormState } from "react-final-form";
import { afterEach, expect, test, vi } from "vitest";

import { useValuesReady } from "./useValuesReady";

import { checkValuesReady } from "./checkValuesReady";

vi.mock("react-final-form");
vi.mock("./checkValuesReady");

vi.mocked(useFormState).mockReturnValue({
	values: {
		test: "testValue",
	},
} as unknown as ReturnType<typeof useFormState>);

afterEach(() => {
	vi.clearAllMocks();
});

test.each([[true], [false]])("values ready = %s", (isReady) => {
	vi.mocked(checkValuesReady).mockReturnValue(isReady);
	expect(useValuesReady()).toBe(isReady);

	expect(checkValuesReady).toHaveBeenCalledTimes(1);
	expect(checkValuesReady).toHaveBeenCalledWith({
		test: "testValue",
	});
});
