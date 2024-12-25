import type { FieldSchemaBase } from "@vtaits/form-schema";
import type { CheckboxSchema } from "@vtaits/react-hook-form-schema/fields/checkbox";
import type { DefaultFieldSchema } from "@vtaits/react-hook-form-schema/form";
import { type ReactElement, useMemo } from "react";
import { FormExample } from "./FormExample";

export function CheckboxStoryComponent({
	formValue,
	schema,
}: {
	schema: CheckboxSchema;
	formValue?: unknown;
}): ReactElement {
	const schemas: Record<string, DefaultFieldSchema<FieldSchemaBase>> = useMemo(
		() => ({
			checkbox: {
				...schema,
				type: "checkbox",
			},
		}),
		[schema],
	);

	const defaultValues = useMemo(
		() => ({
			checkbox: formValue,
		}),
		[formValue],
	);

	return (
		<FormExample
			defaultValues={defaultValues}
			schemas={schemas}
			title="Checkbox field"
		/>
	);
}
