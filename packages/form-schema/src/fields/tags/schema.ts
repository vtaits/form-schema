import type { BaseFieldSchema } from "../base";

export type TagsSchema = BaseFieldSchema & {
	options?: readonly string[];
};
