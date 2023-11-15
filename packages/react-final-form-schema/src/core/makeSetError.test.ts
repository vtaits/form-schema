import { expect, test } from "vitest";
import { makeSetError } from "./makeSetError";

test("set error without parents", () => {
	const target = {
		error1: "description1",
	};

	const setError = makeSetError(target);

	setError("error2", undefined, "description2");

	expect(target).toEqual({
		error1: "description1",
		error2: "description2",
	});
});

test("set error with parents", () => {
	const target = {
		error1: "description1",
	};

	const setError = makeSetError(target);

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

	expect(target).toEqual({
		error1: "description1",
		container1: [
			{
				container2: [
					undefined,
					undefined,
					undefined,
					{
						error2: "description2",
					},
				],
			},
		],
	});
});
