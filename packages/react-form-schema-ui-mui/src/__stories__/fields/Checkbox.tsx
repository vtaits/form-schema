import type { FieldSchemaBase } from "@vtaits/form-schema";
import type { CheckboxSchema } from "@vtaits/react-hook-form-schema/fields/checkbox";
import type { DefaultFieldSchema } from "@vtaits/react-hook-form-schema/form";
import { type ReactElement, useMemo } from "react";
import { FormExample } from "./FormExample";

export function CheckboxStoryComponent(schema: CheckboxSchema): ReactElement {
	const schemas: Record<string, DefaultFieldSchema<FieldSchemaBase>> = useMemo(
		() => ({
			checkbox: {
				...schema,
				type: "checkbox",
			},
		}),
		[schema],
	);

	return <FormExample schemas={schemas} title="Checkbox field" />;
}
