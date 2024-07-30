import type {
	MultiSelectSchema as MultiSelectSchemaBase,
	SelectSchema as SelectSchemaBase,
} from "@vtaits/form-schema/fields/select";
import type { BaseFieldSchema, FormApi } from "../base";

export type SelectSchema = Readonly<
	SelectSchemaBase<FormApi> &
		BaseFieldSchema & {
			placeholder?: string;
		}
>;

export type MultiSelectSchema = Readonly<
	MultiSelectSchemaBase<FormApi> &
		BaseFieldSchema & {
			placeholder?: string;
		}
>;
