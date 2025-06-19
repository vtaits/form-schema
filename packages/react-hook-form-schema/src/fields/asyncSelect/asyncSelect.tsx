import type { FieldType as FieldTypeBase } from "@vtaits/form-schema";
import {
	asyncSelect as asyncSelectBase,
	DEFAULT_LABEL_KEY,
	DEFAULT_VALUE_KEY,
} from "@vtaits/form-schema/fields/asyncSelect";
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
import type { AsyncSelectSchema } from "./schema";
import { useCachingLoadOptions } from "./useCachingLoadOptions";

type AsyncSelectComponentProps = Readonly<{
	renderParams: RenderParams<AsyncSelectSchema, any, any, any, any, any>;
	formResult: UseFormReturn<FieldValues, any, FieldValues>;
}>;

export function SelectComponent({
	renderParams: {
		fieldPath,
		fieldSchema: {
			disabled,
			label,
			hint,
			autoFocus,
			required,
			getOptionLabel: getOptionLabelParam,
			getOptionValue: getOptionValueParam,
			onChange = undefined,
			additional,
			initialAdditional,
			loadOptions,
			labelKey = DEFAULT_LABEL_KEY,
			placeholder,
			valueKey = DEFAULT_VALUE_KEY,
		},
	},
	formResult,
	formResult: {
		control,
		formState: { errors },
	},
}: AsyncSelectComponentProps): ReactElement {
	const { renderAsyncSelect, renderWrapper } = useUI();

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

					return renderAsyncSelect({
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

export const asyncSelect: FieldType<AsyncSelectSchema> = {
	...(asyncSelectBase as FieldTypeBase<AsyncSelectSchema>),

	render: (renderParams, formResult) => (
		<SelectComponent renderParams={renderParams} formResult={formResult} />
	),
};
