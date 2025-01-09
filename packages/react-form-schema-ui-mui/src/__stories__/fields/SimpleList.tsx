import type { FieldSchemaBase } from "@vtaits/form-schema";
import type { ListSchema } from "@vtaits/react-hook-form-schema/fields/list";
import type { DefaultFieldSchema } from "@vtaits/react-hook-form-schema/form";
import { type ReactElement, useMemo } from "react";
import { FormExample } from "./FormExample";

export function SimpleListStoryComponent({
	schema,
	nestedFieldRequired,
	formValue,
}: {
	schema: Omit<ListSchema<unknown>, "itemSchema">;
	nestedFieldRequired: boolean;
	formValue?: unknown;
}): ReactElement {
	const schemas: Record<string, DefaultFieldSchema<FieldSchemaBase>> = useMemo(
		() => ({
			list: {
				type: "list",
				getBlockLabel: (index: number) => `Block #${index + 1}`,
				itemSchema: {
					label: "Input",
					type: "input",
					required: nestedFieldRequired,
				},
				...schema,
			},
		}),
		[nestedFieldRequired, schema],
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
			title="Simple list field"
		/>
	);
}
