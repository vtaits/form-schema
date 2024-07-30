import type { TagsSchema as TagsSchemaBase } from "@vtaits/form-schema/fields/tags";
import type { ReactNode } from "react";
import type { BaseFieldSchema, FormApi } from "../base";

export type TagsSchema = Readonly<
	TagsSchemaBase<FormApi> &
		BaseFieldSchema & {
			createLabel?: ReactNode;
		}
>;
