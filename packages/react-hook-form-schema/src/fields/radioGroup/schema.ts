import type { SelectSchema as SelectSchemaBase } from "@vtaits/form-schema/fields/select";
import type { BaseFieldSchema } from "../base";

export type RadioGroupSchema = Readonly<SelectSchemaBase & BaseFieldSchema>;
