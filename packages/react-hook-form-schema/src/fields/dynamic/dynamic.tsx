import { dynamic as dynamicBase } from "@vtaits/form-schema/fields/dynamic";
import type { FieldType } from "../../core";
import { DynamicField } from "./DynamicField";
import type { DynamicSchema } from "./schema";

export const dynamic: FieldType<DynamicSchema<any>> = {
	...dynamicBase,
	render: (renderParams, formResult) => (
		<DynamicField renderParams={renderParams} formResult={formResult} />
	),
};
