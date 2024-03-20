import type { InputSchema as InputSchemaBase } from "@vtaits/form-schema/fields/input";
import type { HTMLProps } from "react";
import type { BaseFieldSchema } from "../base";

export type InputSchema = Readonly<
	InputSchemaBase &
		BaseFieldSchema & {
			inputProps?: Partial<HTMLProps<HTMLInputElement>>;
		}
>;
