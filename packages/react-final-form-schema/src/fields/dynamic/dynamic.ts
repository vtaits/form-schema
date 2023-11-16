import { dynamic as dynamicBase } from "@vtaits/form-schema/fields/dynamic";
import type { FormApi } from "final-form";

import type { FieldType } from "../../core";
import { DynamicField } from "./component";
import type { DynamicSchema } from "./schema";

export const dynamic: FieldType<DynamicSchema<FormApi, any>> = {
	...dynamicBase,
	component: DynamicField,
};
