import type { SelectSchema as SelectSchemaBase } from "@vtaits/form-schema/fields/select";
import type { BaseFieldSchema, FormApi } from "../base";

export type RadioGroupSchema = Readonly<
	SelectSchemaBase<FormApi> & BaseFieldSchema
>;
