import type { FieldSchemaBase } from "@vtaits/form-schema";
import type { ListSchema } from "@vtaits/react-hook-form-schema/fields/list";
import type { DefaultFieldSchema } from "@vtaits/react-hook-form-schema/form";
import { type ReactElement, useMemo } from "react";
import { FormExample } from "./FormExample";

export function ListOfSetsStoryComponent({
	schema,
	formValue,
}: {
	schema: Omit<ListSchema<unknown>, "itemSchema">;
	formValue?: unknown;
}): ReactElement {
	const schemas: Record<string, DefaultFieldSchema<FieldSchemaBase>> = useMemo(
		() => ({
			list: {
				type: "list",
				getBlockLabel: (index: number) => `Block #${index + 1}`,
				itemSchema: {
					type: "set",
					nested: true,
					schemas: {
						checkbox: {
							type: "checkbox",
							checkboxLabel: "Checkbox",
						},

						date: {
							label: "Date",
							type: "date",
						},
					},
				},
				...schema,
			},
		}),
		[schema],
	);

	const defaultValues = useMemo(
		() => ({
			list: formValue,
		}),
		[formValue],
	);

	return (
		<FormExample
			defaultValues={defaultValues}
			schemas={schemas}
			title="List of sets field"
		/>
	);
}
