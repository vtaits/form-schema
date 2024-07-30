import type { BaseFieldSchema } from "../base";

export type CheckboxSchema<FormApi> = BaseFieldSchema<FormApi, boolean> & {
	isValueInverse?: boolean;
};
