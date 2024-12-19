import type { FieldSchemaBase } from "@vtaits/form-schema";
import type { DateSchema } from "@vtaits/react-hook-form-schema/fields/date";
import type { DefaultFieldSchema } from "@vtaits/react-hook-form-schema/form";
import { type ReactElement, useMemo } from "react";
import { FormExample } from "./FormExample";

export function DateStoryComponent(schema: DateSchema): ReactElement {
	const schemas: Record<string, DefaultFieldSchema<FieldSchemaBase>> = useMemo(
		() => ({
			checkbox: {
				...schema,
				type: "date",
			},
		}),
		[schema],
	);

	return <FormExample schemas={schemas} title="Date field" />;
}
