import { set as setBase } from "@vtaits/form-schema/fields/set";

import type { FieldType } from "../../core";
import { SetField } from "./component";
import type { SetSchema } from "./schema";

export const set: FieldType<SetSchema<any>> = {
	...setBase,
	component: SetField,
};
