import type { FieldSchemaBase } from "@vtaits/form-schema";
import type { RadioGroupSchema } from "@vtaits/react-hook-form-schema/fields/radioGroup";
import type { DefaultFieldSchema } from "@vtaits/react-hook-form-schema/form";
import { type ReactElement, useMemo } from "react";
import { FormExample } from "./FormExample";

export function RadioGroupStoryComponent({
	formValue,
	schema,
}: {
	schema: RadioGroupSchema;
	formValue?: unknown;
}): ReactElement {
	const schemas: Record<string, DefaultFieldSchema<FieldSchemaBase>> = useMemo(
		() => ({
			radioGroup: {
				...schema,
				type: "radioGroup",
			},
		}),
		[schema],
	);

	const defaultValues = useMemo(
		() => ({
			radioGroup: formValue,
		}),
		[formValue],
	);

	return (
		<FormExample
			defaultValues={defaultValues}
			schemas={schemas}
			title="Radio group field"
		/>
	);
}
