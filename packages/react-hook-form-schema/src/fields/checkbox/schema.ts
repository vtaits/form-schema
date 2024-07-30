import type { CheckboxSchema as CheckboxSchemaBase } from "@vtaits/form-schema/fields/checkbox";
import type { ReactNode } from "react";
import type { BaseFieldSchema, FormApi } from "../base";

export type CheckboxSchema = Readonly<
	CheckboxSchemaBase<FormApi> &
		BaseFieldSchema & {
			checkboxLabel?: ReactNode;
		}
>;
