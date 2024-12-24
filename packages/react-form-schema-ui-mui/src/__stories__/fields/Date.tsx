import type { FieldSchemaBase } from "@vtaits/form-schema";
import type { DateSchema } from "@vtaits/react-hook-form-schema/fields/date";
import type { DefaultFieldSchema } from "@vtaits/react-hook-form-schema/form";
import { type ReactElement, useMemo } from "react";
import { FormExample } from "./FormExample";

export function DateStoryComponent({
	required,
	label,
	disabled,
	clientDateFormat,
	displayDateFormat,
	serverDateFormat,
	utc,
	formValue,
}: DateSchema & {
	formValue?: unknown;
}): ReactElement {
	const schemas: Record<string, DefaultFieldSchema<FieldSchemaBase>> = useMemo(
		() => ({
			date: {
				type: "date",
				required,
				label,
				disabled,
				clientDateFormat,
				displayDateFormat,
				serverDateFormat,
				utc,
			},
		}),
		[
			required,
			label,
			disabled,
			clientDateFormat,
			displayDateFormat,
			serverDateFormat,
			utc,
		],
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
			title="Date field"
		/>
	);
}
