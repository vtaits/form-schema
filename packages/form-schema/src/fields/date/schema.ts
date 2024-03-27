import type { BaseFieldSchema } from "../base";

export type DateSchema = BaseFieldSchema & {
	clientDateFormat?: string;
	displayDateFormat?: string;
	serverDateFormat?: string;
};
