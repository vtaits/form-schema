import type { CheckboxSchema as CheckboxSchemaBase } from "@vtaits/form-schema/fields/checkbox";
import type { ReactNode } from "react";
import type { BaseFieldSchema } from "../base";

export type CheckboxSchema = Readonly<
	CheckboxSchemaBase &
		BaseFieldSchema & {
			checkboxLabel?: ReactNode;
		}
>;
