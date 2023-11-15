import { afterEach, expect, test, vi } from "vitest";
import { makeSetError } from "./makeSetError";

const internalSetError = vi.fn();
const ERROR_TYPE = "ERROR_TYPE";
const onError = vi.fn();

const setError = makeSetError(internalSetError, ERROR_TYPE, onError);

afterEach(() => {
	vi.resetAllMocks();
});

test("set error without parents", () => {
	setError("error2", undefined, "description2");

	expect(onError).toHaveBeenCalledTimes(1);

	expect(internalSetError).toHaveBeenCalledTimes(1);
	expect(internalSetError).toHaveBeenCalledWith("error2", {
		type: ERROR_TYPE,
		message: "description2",
	});
});

test("set error with parents", () => {
	setError(
		"error2",
		[
			{ values: {} },
			{ name: "container1", values: {} },
			{ name: 0, values: {} },
			{ name: "container2", values: {} },
			{ name: 3, values: {} },
		],
		"description2",
	);

	expect(onError).toHaveBeenCalledTimes(1);

	expect(internalSetError).toHaveBeenCalledTimes(1);
	expect(internalSetError).toHaveBeenCalledWith(
		"container1.0.container2.3.error2",
		{
			type: ERROR_TYPE,
			message: "description2",
		},
	);
});
