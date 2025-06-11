import type { BuiltInFieldSchema } from "../form/schema";

function mapFiledToSchema(name: string, value: unknown): BuiltInFieldSchema {
	switch (typeof value) {
		case "string":
			return {
				type: "input",
				label: name,
			};

		case "number":
			return {
				type: "input",
				isNumber: true,
				label: name,
			};

		case "boolean":
			return {
				type: "checkbox",
				checkboxLabel: name,
			};

		case "object":
			if (!value) {
				throw new Error("Value can not be empty");
			}

			if (Array.isArray(value)) {
				return {
					type: "list",
					label: name,
					getBlockLabel: (index: number) => `${name} #${index + 1}`,
					itemSchema: mapFiledToSchema(name, value[0]),
				};
			}

			return {
				type: "set",
				nested: true,
				schemas: mapObjectToSchema(value as Record<string, unknown>),
			};

		default:
			throw new Error(
				"Only string, number, boolean, array and object are supported",
			);
	}
}

export function mapObjectToSchema(
	obj: Record<string, unknown>,
): Record<string, BuiltInFieldSchema> {
	const res: Record<string, BuiltInFieldSchema> = {};

	for (const [name, value] of Object.entries(obj)) {
		res[name] = mapFiledToSchema(name, value);
	}

	return res;
}
