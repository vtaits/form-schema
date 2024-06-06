import type { BaseFieldSchema } from "../base";

export type InputSchema = BaseFieldSchema & {
	maxLength?: number;
	minLength?: number;
	options?: readonly string[];
	regExp?: string | RegExp;
};
