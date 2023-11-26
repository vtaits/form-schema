import type { SetSchema as SetSchemaBase } from "@vtaits/form-schema/fields/set";
import type { ReactNode } from "react";

export type SetSchema<FieldSchema> = SetSchemaBase<FieldSchema> & {
	render?: (names: readonly string[]) => ReactNode;
};
