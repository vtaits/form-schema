import type { FieldType as FieldTypeBase } from "@vtaits/form-schema";
import {
	DEFAULT_LABEL_KEY,
	DEFAULT_VALUE_KEY,
	multiSelect as multiSelectBase,
} from "@vtaits/form-schema/fields/select";
import { useUI } from "@vtaits/react-form-schema-base-ui";
import { type ReactElement, useMemo } from "react";
import {
	Controller,
	type FieldValues,
	get,
	type UseFormReturn,
} from "react-hook-form";
import type { FieldType, RenderParams } from "../../core";
import { wrapOnChange } from "../base";
import { renderError } from "../base/renderError";
import type { MultiSelectSchema } from "./schema";
import { useOptionsCache } from "./useOptionsCache";

type MultiSelectComponentProps = Readonly<{
	renderParams: RenderParams<MultiSelectSchema, any, any, any, any, any>;
	formResult: UseFormReturn<FieldValues, any, FieldValues>;
}>;

export function MultiSelectComponent({
	renderParams: {
		fieldPath,
		fieldSchema: {
			disabled,
			hint,
			autoFocus,
			label,
			getOptionLabel: getOptionLabelParam,
			getOptionValue: getOptionValueParam,
			onChange = undefined,
			options,
			labelKey = DEFAULT_LABEL_KEY,
			placeholder,
			valueKey = DEFAULT_VALUE_KEY,
			required,
		},
	},
	formResult,
	formResult: {
		control,
		formState: { errors },
	},
}: MultiSelectComponentProps): ReactElement {
	const { renderMultiSelect, renderWrapper } = useUI();

	const error = renderError(get(errors, fieldPath));

	const wrapperParams = {
		error,
		hint,
		label,
		name: fieldPath,
		required,
	};

	const getOptionLabel = useMemo(() => {
		if (getOptionLabelParam) {
			return getOptionLabelParam;
		}

		return (option: unknown) => (option as Record<string, string>)[labelKey];
	}, [getOptionLabelParam, labelKey]);

	const getOptionValue = useMemo(() => {
		if (getOptionValueParam) {
			return getOptionValueParam;
		}

		return (option: unknown) => (option as Record<string, string>)[valueKey];
	}, [getOptionValueParam, valueKey]);

	const optionsCacheRef = useOptionsCache(options, getOptionValue);

	return renderWrapper({
		...wrapperParams,
		children: (
			<Controller
				control={control}
				name={fieldPath}
				render={({ field }) => {
					const wrappedOnChange = wrapOnChange(
						field.onChange,
						onChange,
						formResult,
						field.value,
					);

					return renderMultiSelect({
						disabled,
						value: Array.isArray(field.value) ? field.value : [],
						name: fieldPath,
						getOptionLabel,
						getOptionValue,
						handleClear: () => {
							wrappedOnChange([]);
						},
						autoFocus,
						onChange: wrappedOnChange,
						options,
						optionsCacheRef,
						placeholder,
						wrapper: wrapperParams,
					}) as ReactElement;
				}}
			/>
		),
	}) as ReactElement;
}

export const multiSelect: FieldType<MultiSelectSchema> = {
	...(multiSelectBase as FieldTypeBase<MultiSelectSchema>),

	render: (renderParams, formResult) => (
		<MultiSelectComponent renderParams={renderParams} formResult={formResult} />
	),
};
