import { BaseFieldSchema } from "../base";

export type SelectSchema = BaseFieldSchema & {
	options: readonly unknown[];
	valueKey?: string;
	labelKey?: string;
	getOptionValue?: (option: unknown) => string;
	getOptionLabel?: (option: unknown) => string;
};

export type MultiSelectSchema = SelectSchema & {
	minLength?: number;
	maxLength?: number;
};
