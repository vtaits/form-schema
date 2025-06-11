import { expect, test } from "vitest";
import { mapObjectToSchema } from "./mapObjectToSchema";

test("should get correct schema", () => {
	expect(
		mapObjectToSchema({
			string: "foo",
			number: 123,
			boolean: true,
			set: {
				string: "foo",
				number: 123,
			},
			array: ["foo", "bar"],
			setArray: [
				{
					string: "foo",
					number: 123,
				},
			],
		}),
	).toEqual({
		array: {
			getBlockLabel: expect.any(Function),
			itemSchema: {
				label: "array",
				type: "input",
			},
			label: "array",
			type: "list",
		},
		boolean: {
			checkboxLabel: "boolean",
			type: "checkbox",
		},
		number: {
			isNumber: true,
			label: "number",
			type: "input",
		},
		set: {
			nested: true,
			schemas: {
				number: {
					isNumber: true,
					label: "number",
					type: "input",
				},
				string: {
					label: "string",
					type: "input",
				},
			},
			type: "set",
		},
		setArray: {
			getBlockLabel: expect.any(Function),
			itemSchema: {
				nested: true,
				schemas: {
					number: {
						isNumber: true,
						label: "number",
						type: "input",
					},
					string: {
						label: "string",
						type: "input",
					},
				},
				type: "set",
			},
			label: "setArray",
			type: "list",
		},
		string: {
			label: "string",
			type: "input",
		},
	});
});
