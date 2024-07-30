import type { DateSchema as DateSchemaBase } from "@vtaits/form-schema/fields/date";
import type { HTMLProps } from "react";
import type { BaseFieldSchema, FormApi } from "../base";

export type DateSchema = Readonly<
	DateSchemaBase<FormApi> &
		BaseFieldSchema & {
			inputProps?: Partial<HTMLProps<HTMLInputElement>>;
		}
>;
