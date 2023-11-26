import { getAll } from "react-shallow-search";
import { afterEach, expect, test, vi } from "vitest";

import { FormField } from "../../core";
import { defaultRender } from "./defaultRender";

afterEach(() => {
	vi.clearAllMocks();
});

test("render correctly", () => {
	const result = defaultRender(["name1", "name2"]);

	const fields = getAll(result, {
		component: FormField,
	});

	expect(fields.length).toBe(2);
	expect(fields[0].props.name).toBe("name1");
	expect(fields[1].props.name).toBe("name2");
});
