import type {
	MultiSelectSchema as MultiSelectSchemaBase,
	SelectSchema as SelectSchemaBase,
} from "@vtaits/form-schema/fields/select";
import type { ReactNode } from "react";
import type { BaseFieldSchema, FormApi } from "../base";

export type SelectSchema = Readonly<
	SelectSchemaBase<FormApi> &
		BaseFieldSchema & {
			placeholder?: string;
			renderOption?: (option: unknown, payload: unknown) => ReactNode;
		}
>;

export type MultiSelectSchema = Readonly<
	MultiSelectSchemaBase<FormApi> &
		BaseFieldSchema & {
			placeholder?: string;
			renderOption?: (option: unknown, payload: unknown) => ReactNode;
		}
>;
