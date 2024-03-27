import type { DateTimeSchema as DateTimeSchemaBase } from "@vtaits/form-schema/fields/datetime";
import type { HTMLProps } from "react";
import type { BaseFieldSchema } from "../base";

export type DateTimeSchema = Readonly<
	DateTimeSchemaBase &
		BaseFieldSchema & {
			inputProps?: Partial<HTMLProps<HTMLInputElement>>;
		}
>;
