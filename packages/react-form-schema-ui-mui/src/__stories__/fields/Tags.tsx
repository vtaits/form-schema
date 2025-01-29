import type { FieldSchemaBase } from "@vtaits/form-schema";
import type { TagsSchema } from "@vtaits/react-hook-form-schema/fields/tags";
import type { DefaultFieldSchema } from "@vtaits/react-hook-form-schema/form";
import { type ReactElement, useMemo } from "react";
import { FormExample } from "./FormExample";

export function TagsStoryComponent({
	formValue,
	schema,
}: {
	schema: TagsSchema;
	formValue?: unknown;
}): ReactElement {
	const schemas: Record<string, DefaultFieldSchema<FieldSchemaBase>> = useMemo(
		() => ({
			tags: {
				...schema,
				type: "tags",
			},
		}),
		[schema],
	);

	const defaultValues = useMemo(
		() => ({
			tags: formValue,
		}),
		[formValue],
	);

	return (
		<FormExample
			defaultValues={defaultValues}
			schemas={schemas}
			title="Tags field"
		/>
	);
}
