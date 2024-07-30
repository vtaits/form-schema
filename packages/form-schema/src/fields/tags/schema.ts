import type { BaseFieldSchema } from "../base";

export type TagsSchema<FormApi> = BaseFieldSchema<
	FormApi,
	readonly string[]
> & {
	options?: readonly string[];
};
