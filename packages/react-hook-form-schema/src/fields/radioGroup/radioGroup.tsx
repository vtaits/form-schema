import type { FieldType as FieldTypeBase } from "@vtaits/form-schema";
import {
	DEFAULT_LABEL_KEY,
	DEFAULT_VALUE_KEY,
	select as selectBase,
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
import { useOptionsCache } from "../select";
import type { RadioGroupSchema } from "./schema";

type RadioGroupComponentProps = Readonly<{
	renderParams: RenderParams<RadioGroupSchema, any, any, any, any, any>;
	formResult: UseFormReturn<FieldValues, any, FieldValues>;
}>;

export function RadioGroupComponent({
	renderParams: {
		fieldPath,
		fieldSchema: {
			disabled,
			hint,
			autoFocus,
			label,
			required,
			getOptionLabel: getOptionLabelParam,
			getOptionValue: getOptionValueParam,
			onChange = undefined,
			options,
			labelKey = DEFAULT_LABEL_KEY,
			valueKey = DEFAULT_VALUE_KEY,
		},
	},
	formResult,
	formResult: {
		control,
		formState: { errors },
	},
}: RadioGroupComponentProps): ReactElement {
	const { renderRadioGroup, renderWrapper } = useUI();

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

					return renderRadioGroup({
						clearable: !required,
						disabled,
						value: field.value,
						name: fieldPath,
						getOptionLabel,
						getOptionValue,
						handleClear: () => {
							wrappedOnChange(null);
						},
						autoFocus,
						onChange: wrappedOnChange,
						options,
						optionsCacheRef,
						wrapper: wrapperParams,
					}) as ReactElement;
				}}
			/>
		),
	}) as ReactElement;
}

export const radioGroup: FieldType<RadioGroupSchema> = {
	...(selectBase as FieldTypeBase<RadioGroupSchema>),

	render: (renderParams, formResult) => (
		<RadioGroupComponent renderParams={renderParams} formResult={formResult} />
	),
};
