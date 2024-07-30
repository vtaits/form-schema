import type { OnChange } from "@vtaits/form-schema/fields/base";
import type { FormApi } from "./types";

export function wrapOnChange<ValueType>(
	baseOnChange: (...event: any[]) => void,
	fieldOnChange: OnChange<FormApi, ValueType> | undefined,
	formApi: FormApi,
	prevValue: ValueType,
) {
	if (!fieldOnChange) {
		return baseOnChange;
	}

	return (nextValue: ValueType) => {
		baseOnChange(nextValue);
		fieldOnChange(formApi, nextValue, prevValue);
	};
}
