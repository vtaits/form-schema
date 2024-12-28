import type { FieldSchemaBase } from "@vtaits/form-schema";
import type { SelectSchema } from "@vtaits/react-hook-form-schema/fields/select";
import type { DefaultFieldSchema } from "@vtaits/react-hook-form-schema/form";
import { type ReactElement, useMemo } from "react";
import { FormExample } from "./FormExample";

export function SelectStoryComponent({
	formValue,
	schema,
}: {
	schema: SelectSchema;
	formValue?: unknown;
}): ReactElement {
	const schemas: Record<string, DefaultFieldSchema<FieldSchemaBase>> = useMemo(
		() => ({
			select: {
				...schema,
				type: "select",
			},
		}),
		[schema],
	);

	const defaultValues = useMemo(
		() => ({
			select: formValue,
		}),
		[formValue],
	);

	return (
		<FormExample
			defaultValues={defaultValues}
			schemas={schemas}
			title="Select field"
		/>
	);
}
