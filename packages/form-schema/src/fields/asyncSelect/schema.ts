import type { LoadOptions } from "select-async-paginate-model";
import type { BaseFieldSchema } from "../base";

type AsyncSelectParams<OptionType, Additional> = {
	loadOptions: LoadOptions<OptionType, Additional>;
	loadSingleOption?: (rawValue: unknown) => OptionType | Promise<OptionType>;
	initialAdditional?: Additional;
	additional?: Additional;
	valueKey?: string;
	labelKey?: string;
	getOptionValue?: (option: unknown) => string;
	getOptionLabel?: (option: unknown) => string;
};

export type AsyncSelectSchema<FormApi> = BaseFieldSchema<FormApi, unknown> &
	AsyncSelectParams<unknown, unknown>;

export type AsyncMultiSelectSchema<FormApi> = BaseFieldSchema<
	FormApi,
	readonly unknown[]
> &
	AsyncSelectParams<unknown, unknown> & {
		minLength?: number;
		maxLength?: number;
	};
