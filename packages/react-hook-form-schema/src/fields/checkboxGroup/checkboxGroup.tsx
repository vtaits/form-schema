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
import { getFieldName } from "../base";
import { renderError } from "../base/renderError";
import type { CheckboxGroupSchema } from "./schema";

type CheckboxGroupComponentProps = Readonly<{
	renderParams: RenderParams<CheckboxGroupSchema, any, any, any, any, any>;
	formResult: UseFormReturn<FieldValues, any, FieldValues>;
}>;

export function CheckboxGroupComponent({
	renderParams: {
		fieldSchema: {
			label,
			hint,
			getOptionLabel: getOptionLabelParam,
			getOptionValue: getOptionValueParam,
			options,
			labelKey = DEFAULT_LABEL_KEY,
			valueKey = DEFAULT_VALUE_KEY,
		},
		name: nameParam,
		parents,
	},
	formResult: { control, formState: { errors }, register },
}: CheckboxGroupComponentProps): ReactElement {
	const { renderCheckboxGroup, renderWrapper } = useUI();

	const name = getFieldName(nameParam, parents);
	const error = renderError(get(errors, name));

	const wrapperParams = {
		error,
		hint,
		label,
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
				name={name}
				render={({ field }) =>
					renderCheckboxGroup({
						value: field.value,
						name,
						getOptionLabel,
						getOptionValue,
						handleClear: () => {
							field.onChange(null);
						},
						onChange: field.onChange,
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
