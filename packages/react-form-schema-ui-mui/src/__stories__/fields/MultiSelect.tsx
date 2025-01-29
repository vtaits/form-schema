import type { FieldSchemaBase } from "@vtaits/form-schema";
import type { MultiSelectSchema } from "@vtaits/react-hook-form-schema/fields/select";
import type { DefaultFieldSchema } from "@vtaits/react-hook-form-schema/form";
import { type ReactElement, useMemo } from "react";
import { FormExample } from "./FormExample";

export function MultiSelectStoryComponent({
	formValue,
	schema,
}: {
	schema: MultiSelectSchema;
	formValue?: unknown;
}): ReactElement {
	const schemas: Record<string, DefaultFieldSchema<FieldSchemaBase>> = useMemo(
		() => ({
			multiSelect: {
				...schema,
				type: "multiSelect",
			},
		}),
		[schema],
	);

	const defaultValues = useMemo(
		() => ({
			multiSelect: formValue,
		}),
		[formValue],
	);

	return (
		<FormExample
			defaultValues={defaultValues}
			schemas={schemas}
			title="Multi select field"
		/>
	);
}
