import type { InputSchema as InputSchemaBase } from "@vtaits/form-schema/fields/input";
import type { HTMLProps } from "react";
import type { BaseFieldSchema, FormApi } from "../base";

export type TextAreaSchema = Readonly<
	InputSchemaBase<FormApi> &
		BaseFieldSchema & {
			textAreaProps?: Partial<HTMLProps<HTMLTextAreaElement>>;
		}
>;
