import type { FieldType as FieldTypeBase } from "@vtaits/form-schema";
import {
	DEFAULT_LABEL_KEY,
	DEFAULT_VALUE_KEY,
	multiSelect as multiSelectBase,
} from "@vtaits/form-schema/fields/select";
import { useUI } from "@vtaits/react-form-schema-base-ui";
import get from "lodash/get";
import { type ReactElement, useMemo } from "react";
import {
	Controller,
	type FieldValues,
	type UseFormReturn,
} from "react-hook-form";
import type { FieldType, RenderParams } from "../../core";
import { wrapOnChange } from "../base";
import { renderError } from "../base/renderError";
import type { CheckboxGroupSchema } from "./schema";

type CheckboxGroupComponentProps = Readonly<{
	renderParams: RenderParams<CheckboxGroupSchema, any, any, any, any, any>;
	formResult: UseFormReturn<FieldValues, any, FieldValues>;
}>;

export function CheckboxGroupComponent({
	renderParams: {
		fieldPath,
		fieldSchema: {
			disabled,
			label,
			hint,
			autoFocus,
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
}: CheckboxGroupComponentProps): ReactElement {
	const { renderCheckboxGroup, renderWrapper } = useUI();

	const error = renderError(get(errors, fieldPath));

	const wrapperParams = {
		error,
		hint,
		label,
		name: fieldPath,
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

	return renderWrapper({
		...wrapperParams,
		children: (
			<Controller
				control={control}
				name={fieldPath}
				render={({ field }) =>
					renderCheckboxGroup({
						disabled,
						autoFocus,
						value: field.value,
						name: fieldPath,
						getOptionLabel,
						getOptionValue,
						handleClear: () => {
							field.onChange(null);
						},
						onChange: wrapOnChange(
							field.onChange,
							onChange,
							formResult,
							field.value,
						),
						options,
						wrapper: wrapperParams,
					}) as ReactElement
				}
			/>
		),
	}) as ReactElement;
}

export const checkboxGroup: FieldType<CheckboxGroupSchema> = {
	...(multiSelectBase as FieldTypeBase<CheckboxGroupSchema>),

	render: (renderParams, formResult) => (
		<CheckboxGroupComponent
			renderParams={renderParams}
			formResult={formResult}
		/>
	),
};
