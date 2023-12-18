import type {
	MultiSelectSchema as MultiSelectSchemaBase,
	SelectSchema as SelectSchemaBase,
} from "@vtaits/form-schema/fields/select";
import type { BaseFieldSchema } from "../base";

export type SelectSchema = Readonly<
	SelectSchemaBase &
		BaseFieldSchema & {
			placeholder?: string;
		}
>;

export type MultiSelectSchema = Readonly<
	MultiSelectSchemaBase &
		BaseFieldSchema & {
			placeholder?: string;
		}
>;
