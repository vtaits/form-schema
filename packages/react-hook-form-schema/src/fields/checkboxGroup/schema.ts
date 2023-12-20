import type { MultiSelectSchema as MultiSelectSchemaBase } from "@vtaits/form-schema/fields/select";
import type { BaseFieldSchema } from "../base";

export type CheckboxGroupSchema = Readonly<
	MultiSelectSchemaBase & BaseFieldSchema
>;
