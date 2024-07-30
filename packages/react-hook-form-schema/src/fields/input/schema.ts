import type { InputSchema as InputSchemaBase } from "@vtaits/form-schema/fields/input";
import type { HTMLProps } from "react";
import type { BaseFieldSchema, FormApi } from "../base";

export type InputSchema = Readonly<
	InputSchemaBase<FormApi> &
		BaseFieldSchema & {
			inputProps?: Partial<HTMLProps<HTMLInputElement>>;
		}
>;
