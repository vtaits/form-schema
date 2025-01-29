import type { FieldSchemaBase } from "@vtaits/form-schema";
import type { TextAreaSchema } from "@vtaits/react-hook-form-schema/fields/textarea";
import type { DefaultFieldSchema } from "@vtaits/react-hook-form-schema/form";
import { type ReactElement, useMemo } from "react";
import { FormExample } from "./FormExample";

export function TextareaStoryComponent({
	schema,
	formValue,
}: {
	schema: TextAreaSchema;
	formValue?: unknown;
}): ReactElement {
	const schemas: Record<string, DefaultFieldSchema<FieldSchemaBase>> = useMemo(
		() => ({
			textarea: {
				type: "textarea",
				...schema,
			},
		}),
		[schema],
	);

	const defaultValues = useMemo(
		() => ({
			textarea: formValue,
		}),
		[formValue],
	);

	return (
		<FormExample
			defaultValues={defaultValues}
			schemas={schemas}
			title="Textarea field"
		/>
	);
}
