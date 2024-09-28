import type { FileSchema as FileSchemaBase } from "@vtaits/form-schema/fields/file";
import type { ReactNode } from "react";
import type { BaseFieldSchema, FormApi } from "../base";

export type FileSchema = Readonly<
	FileSchemaBase<FormApi> &
		BaseFieldSchema & {
			text?: ReactNode;
		}
>;
