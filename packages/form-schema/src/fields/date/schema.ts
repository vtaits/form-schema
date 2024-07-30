import type { BaseFieldSchema } from "../base";

export type DateSchema<FormApi> = BaseFieldSchema<
	FormApi,
	string | number | Date | null
> & {
	clientDateFormat?: string;
	displayDateFormat?: string;
	serverDateFormat?: string;
};
