import type { FieldSchemaBase } from "@vtaits/form-schema";
import type { FileSchema } from "@vtaits/react-hook-form-schema/fields/file";
import type { DefaultFieldSchema } from "@vtaits/react-hook-form-schema/form";
import { type ReactElement, useMemo } from "react";
import { FormExample } from "./FormExample";

export function FileStoryComponent({
	schema,
	formValue,
}: {
	schema: FileSchema;
	formValue?: unknown;
}): ReactElement {
	const schemas: Record<string, DefaultFieldSchema<FieldSchemaBase>> = useMemo(
		() => ({
			file: {
				type: "file",
				...schema,
			},
		}),
		[schema],
	);

	const defaultValues = useMemo(
		() => ({
			file: formValue,
		}),
		[formValue],
	);

	return (
		<FormExample
			defaultValues={defaultValues}
			schemas={schemas}
			title="File field"
		/>
	);
}
