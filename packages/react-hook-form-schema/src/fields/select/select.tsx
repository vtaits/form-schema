import type { FieldType as FieldTypeBase } from "@vtaits/form-schema";
import {
	DEFAULT_LABEL_KEY,
	DEFAULT_VALUE_KEY,
	select as selectBase,
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
import type { SelectSchema } from "./schema";

type SelectComponentProps = Readonly<{
	renderParams: RenderParams<SelectSchema, any, any, any, any, any>;
	formResult: UseFormReturn<FieldValues, any, FieldValues>;
}>;

export function SelectComponent({
	renderParams: {
		fieldSchema: {
			label,
			hint,
			required,
			getOptionLabel: getOptionLabelParam,
			getOptionValue: getOptionValueParam,
			options,
			labelKey = DEFAULT_LABEL_KEY,
			placeholder,
			valueKey = DEFAULT_VALUE_KEY,
		},
		name: nameParam,
		parents,
	},
	formResult: { control, formState: { errors }, register },
}: SelectComponentProps): ReactElement {
	const { renderSelect, renderWrapper } = useUI();

	const name = getFieldName(nameParam, parents);
	const error = get(errors, name);

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
					renderSelect({
						clearable: !required,
						value: field.value,
						name,
						getOptionLabel,
						getOptionValue,
						handleClear: () => {
							field.onChange(null);
						},
						onChange: field.onChange,
						options,
						placeholder,
						wrapper: wrapperParams,
					}) as ReactElement
				}
			/>
		),
	}) as ReactElement;
}

export const select: FieldType<SelectSchema> = {
	...(selectBase as FieldTypeBase<SelectSchema>),

	render: (renderParams, formResult) => (
		<SelectComponent renderParams={renderParams} formResult={formResult} />
	),
};
