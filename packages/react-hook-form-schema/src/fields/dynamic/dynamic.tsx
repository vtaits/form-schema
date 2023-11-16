import { dynamic as dynamicBase } from "@vtaits/form-schema/fields/dynamic";
import type { UseFormReturn } from "react-hook-form";

import type { FieldType } from "../../core";
import { DynamicField } from "./DynamicField";
import type { DynamicSchema } from "./schema";

export const dynamic: FieldType<
	DynamicSchema<UseFormReturn<any, any, any>, any>
> = {
	...dynamicBase,
	render: (renderParams, formResult) => (
		<DynamicField renderParams={renderParams} formResult={formResult} />
	),
};
