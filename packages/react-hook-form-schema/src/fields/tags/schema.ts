import type { TagsSchema as TagsSchemaBase } from "@vtaits/form-schema/fields/tags";
import type { ReactNode } from "react";
import type { BaseFieldSchema } from "../base";

export type TagsSchema = Readonly<
	TagsSchemaBase &
		BaseFieldSchema & {
			createLabel?: ReactNode;
		}
>;
