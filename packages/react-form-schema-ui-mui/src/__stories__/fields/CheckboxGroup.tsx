import type { FieldSchemaBase } from "@vtaits/form-schema";
import type { CheckboxGroupSchema } from "@vtaits/react-hook-form-schema/fields/checkboxGroup";
import type { DefaultFieldSchema } from "@vtaits/react-hook-form-schema/form";
import { type ReactElement, useMemo } from "react";
import { FormExample } from "./FormExample";

export function CheckboxGroupStoryComponent({
	formValue,
	label,
	disabled,
	required,
	options,
}: CheckboxGroupSchema & {
	formValue?: unknown;
}): ReactElement {
	const schemas: Record<string, DefaultFieldSchema<FieldSchemaBase>> = useMemo(
		() => ({
			checkboxGroup: {
				type: "checkboxGroup",
				label,
				disabled,
				required,
				options,
			},
		}),
		[label, disabled, required, options],
	);

	const defaultValues = useMemo(
		() => ({
			checkboxGroup: formValue,
		}),
		[formValue],
	);

	return (
		<FormExample
			defaultValues={defaultValues}
			schemas={schemas}
			title="Checkbox group field"
		/>
	);
}
