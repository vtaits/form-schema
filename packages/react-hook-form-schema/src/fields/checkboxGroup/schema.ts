import type { MultiSelectSchema as MultiSelectSchemaBase } from "@vtaits/form-schema/fields/select";
import type { BaseFieldSchema, FormApi } from "../base";

export type CheckboxGroupSchema = Readonly<
	MultiSelectSchemaBase<FormApi> & BaseFieldSchema
>;
