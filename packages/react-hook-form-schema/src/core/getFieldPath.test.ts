import { expect, test } from "vitest";
import { getFieldPath } from "./getFieldPath";

test("should return field name for empty parents array", () => {
	expect(getFieldPath("field", [])).toBe("field");
});

test("should collect field path", () => {
	expect(
		getFieldPath("field", [
			{
				values: {},
			},
			{
				name: "list",
				values: [],
			},
			{
				name: 0,
				values: {},
			},
			{
				name: "subGroup",
				values: {},
			},
		]),
	).toBe("list.0.subGroup.field");
});
