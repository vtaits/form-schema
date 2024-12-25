import type { FieldSchemaBase } from "@vtaits/form-schema";
import type { DateTimeSchema } from "@vtaits/react-hook-form-schema/fields/datetime";
import type { DefaultFieldSchema } from "@vtaits/react-hook-form-schema/form";
import { type ReactElement, useMemo } from "react";
import { FormExample } from "./FormExample";

export function DatetimeStoryComponent({
	schema,
	formValue,
}: {
	schema: DateTimeSchema;
	formValue?: unknown;
}): ReactElement {
	const schemas: Record<string, DefaultFieldSchema<FieldSchemaBase>> = useMemo(
		() => ({
			date: {
				...schema,
				type: "datetime",
			},
		}),
		[schema],
	);

	const defaultValues = useMemo(
		() => ({
			date: formValue,
		}),
		[formValue],
	);

	return (
		<FormExample
			defaultValues={defaultValues}
			schemas={schemas}
			title="Datetime field"
		/>
	);
}
