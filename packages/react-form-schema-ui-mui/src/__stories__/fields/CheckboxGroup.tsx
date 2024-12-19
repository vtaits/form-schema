import type { FieldSchemaBase } from "@vtaits/form-schema";
import type { CheckboxGroupSchema } from "@vtaits/react-hook-form-schema/fields/checkboxGroup";
import type { DefaultFieldSchema } from "@vtaits/react-hook-form-schema/form";
import { type ReactElement, useMemo } from "react";
import { FormExample } from "./FormExample";

export function CheckboxGroupStoryComponent(
	schema: CheckboxGroupSchema,
): ReactElement {
	const schemas: Record<string, DefaultFieldSchema<FieldSchemaBase>> = useMemo(
		() => ({
			checkboxGroup: {
				type: "checkboxGroup",
				...schema,
			},
		}),
		[schema],
	);

	return <FormExample schemas={schemas} title="Checkbox group field" />;
}
