import { afterEach, expect, test, vi } from "vitest";

import { get } from "react-shallow-search";
import { defaultRender } from "./defaultRender";

afterEach(() => {
	vi.clearAllMocks();
});

test("render correctly", () => {
	const renderField = vi
		.fn()
		.mockReturnValue("content1")
		.mockReturnValue("content2");

	const result = defaultRender(renderField, ["name1", "name2"]);

	expect(renderField).toHaveBeenCalledTimes(2);
	expect(renderField).toHaveBeenNthCalledWith(1, "name1");
	expect(renderField).toHaveBeenNthCalledWith(2, "name2");

	expect(
		get(result, {
			props: {
				children: "content1",
			},
		}),
	).toBeTruthy();
	expect(
		get(result, {
			props: {
				children: "content2",
			},
		}),
	).toBeTruthy();
});
