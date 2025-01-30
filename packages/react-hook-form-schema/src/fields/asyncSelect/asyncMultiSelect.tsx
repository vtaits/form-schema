import type { FieldType as FieldTypeBase } from "@vtaits/form-schema";
import {
	DEFAULT_LABEL_KEY,
	DEFAULT_VALUE_KEY,
	asyncMultiSelect as asyncMultiSelectBase,
} from "@vtaits/form-schema/fields/asyncSelect";
import { useUI } from "@vtaits/react-form-schema-base-ui";
import { type ReactElement, useMemo } from "react";
import { get } from "react-hook-form";
import {
	Controller,
	type FieldValues,
	type UseFormReturn,
} from "react-hook-form";
import type { FieldType, RenderParams } from "../../core";
import { wrapOnChange } from "../base";
import { renderError } from "../base/renderError";
import type { AsyncMultiSelectSchema } from "./schema";
import { useCachingLoadOptions } from "./useCachingLoadOptions";

type AsyncMultiSelectComponentProps = Readonly<{
	renderParams: RenderParams<AsyncMultiSelectSchema, any, any, any, any, any>;
	formResult: UseFormReturn<FieldValues, any, FieldValues>;
}>;

export function AsyncMultiSelectComponent({
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
			additional,
			initialAdditional,
			loadOptions,
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
}: AsyncMultiSelectComponentProps): ReactElement {
	const { renderAsyncMultiSelect, renderWrapper } = useUI();

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

	const [optionsCacheRef, loadOptionsProxy] = useCachingLoadOptions(
		loadOptions,
		getOptionValue,
	);

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

					return renderAsyncMultiSelect({
						disabled,
						value: field.value,
						name: fieldPath,
						getOptionLabel,
						getOptionValue,
						handleClear: () => {
							wrappedOnChange([]);
						},
						autoFocus,
						onChange: wrappedOnChange,
						additional,
						initialAdditional,
						optionsCacheRef,
						loadOptions: loadOptionsProxy,
						placeholder,
						wrapper: wrapperParams,
					}) as ReactElement;
				}}
			/>
		),
	}) as ReactElement;
}

export const asyncMultiSelect: FieldType<AsyncMultiSelectSchema> = {
	...(asyncMultiSelectBase as FieldTypeBase<AsyncMultiSelectSchema>),

	render: (renderParams, formResult) => (
		<AsyncMultiSelectComponent
			renderParams={renderParams}
			formResult={formResult}
		/>
	),
};
