import type {
	AsyncMultiSelectSchema as AsyncMultiSelectSchemaBase,
	AsyncSelectSchema as AsyncSelectSchemaBase,
} from "@vtaits/form-schema/fields/asyncSelect";
import type { BaseFieldSchema, FormApi } from "../base";

export type AsyncSelectSchema = Readonly<
	AsyncSelectSchemaBase<FormApi> &
		BaseFieldSchema & {
			placeholder?: string;
		}
>;

export type AsyncMultiSelectSchema = Readonly<
	AsyncMultiSelectSchemaBase<FormApi> &
		BaseFieldSchema & {
			placeholder?: string;
		}
>;
