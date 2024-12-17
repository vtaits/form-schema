import type { FieldSchemaBase } from "@vtaits/form-schema";
import type { DateTimeSchema } from "@vtaits/react-hook-form-schema/fields/datetime";
import {
	type DefaultFieldSchema,
} from "@vtaits/react-hook-form-schema/form";
import { type ReactElement, useMemo } from "react";
import { FormExample } from "./FormExample";

export function DatetimeStoryComponent(schema: DateTimeSchema): ReactElement {
	const schemas: Record<string, DefaultFieldSchema<FieldSchemaBase>> = useMemo(
		() => ({
			checkbox: {
				...schema,
				type: "datetime",
			},
		}),
		[schema],
	);

	return (
			<FormExample
				schemas={schemas}
				title="Datetime field"
			/>
	);
}
