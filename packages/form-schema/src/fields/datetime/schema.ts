import type { BaseFieldSchema } from "../base";

export type DateTimeSchema = BaseFieldSchema & {
	clientDateFormat?: string;
	displayDateFormat?: string;
	serverDateFormat?: string;
};
