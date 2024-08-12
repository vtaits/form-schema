import { dynamic as dynamicBase } from "@vtaits/form-schema/fields/dynamic";
import type { FieldType } from "../../core";
import { DynamicField } from "./component";
import type { DynamicSchema } from "./schema";

export const dynamic: FieldType<DynamicSchema<any>> = {
	...dynamicBase,
	component: DynamicField,
};
