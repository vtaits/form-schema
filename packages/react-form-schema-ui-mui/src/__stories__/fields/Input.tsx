import type { FieldSchemaBase } from "@vtaits/form-schema";
import type { InputSchema } from "@vtaits/react-hook-form-schema/fields/input";
import type { DefaultFieldSchema } from "@vtaits/react-hook-form-schema/form";
import { type ReactElement, useMemo } from "react";
import { FormExample } from "./FormExample";

export function InputStoryComponent({
	schema,
	formValue,
}: {
	schema: InputSchema;
	formValue?: unknown;
}): ReactElement {
	const schemas: Record<string, DefaultFieldSchema<FieldSchemaBase>> = useMemo(
		() => ({
			input: {
				type: "input",
				...schema,
			},
		}),
		[schema],
	);

	const defaultValues = useMemo(
		() => ({
			input: formValue,
		}),
		[formValue],
	);

	return (
		<FormExample
			defaultValues={defaultValues}
			schemas={schemas}
			title="Input field"
		/>
	);
}
