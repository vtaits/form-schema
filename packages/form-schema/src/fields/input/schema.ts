import type { BaseFieldSchema } from "../base";

export type InputSchema = BaseFieldSchema & {
	maxLength?: number;
	minLength?: number;
	regExp?: string | RegExp;
};
