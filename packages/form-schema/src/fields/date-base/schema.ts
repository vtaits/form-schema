import type { BaseFieldSchema } from "../base";

export type DateBaseSchema<FormApi> = BaseFieldSchema<
	FormApi,
	string | number | Date | null
> & {
	clientDateFormat?: string;
	displayDateFormat?: string;
	serverDateFormat?: string;
	utc?: boolean;
};
