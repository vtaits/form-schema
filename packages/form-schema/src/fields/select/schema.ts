import type { BaseFieldSchema } from "../base";

type SelectParams = {
	options: readonly unknown[];
	valueKey?: string;
	labelKey?: string;
	getOptionValue?: (option: unknown) => string | number;
	getOptionLabel?: (option: unknown) => string;
};

export type SelectSchema<FormApi> = BaseFieldSchema<FormApi, unknown> &
	SelectParams;

export type MultiSelectSchema<FormApi> = BaseFieldSchema<
	FormApi,
	readonly unknown[]
> &
	SelectParams & {
		minLength?: number;
		maxLength?: number;
	};
