import type { SetSchema as SetSchemaBase } from "@vtaits/form-schema/fields/set";
import type { ReactNode } from "react";
import type { FieldValues } from "react-hook-form";

import type { RenderField } from "../../core";

export type SetSchema<
	FieldSchema,
	Values extends FieldValues = FieldValues,
	Payload = any,
> = SetSchemaBase<FieldSchema> & {
	render?: (
		renderField: RenderField<Values, Payload>,
		names: readonly string[],
	) => ReactNode;
};
