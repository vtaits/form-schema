import type { BaseFieldSchema } from "../base";

export type InputSchema = BaseFieldSchema & {
	maxLength?: number;
	minLength?: number;
	/**
	 * serialize as a number
	 */
	isNumber?: boolean;
	/**
	 * autocomplete suggestions
	 */
	options?: readonly string[];
	regExp?: string | RegExp;
};
