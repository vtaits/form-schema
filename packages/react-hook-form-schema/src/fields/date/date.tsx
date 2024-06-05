import type { FieldType as FieldTypeBase } from "@vtaits/form-schema";
import {
	DEFAULT_CLIENT_DATE_FORMAT,
	DEFAULT_DISPLAY_DATE_FORMAT,
	date as dateBase,
} from "@vtaits/form-schema/fields/date";
import {
	parseValueAndValidate,
	serializeDate,
} from "@vtaits/form-schema/fields/date-base";
import { useUI } from "@vtaits/react-form-schema-base-ui";
import get from "lodash/get";
import type { ReactElement } from "react";
import {
	Controller,
	type FieldValues,
	type UseFormReturn,
} from "react-hook-form";
import type { FieldType, RenderParams } from "../../core";
import { renderError } from "../base/renderError";
import type { DateSchema } from "./schema";

type DateComponentProps = Readonly<{
	renderParams: RenderParams<DateSchema, any, any, any, any, any>;
	formResult: UseFormReturn<FieldValues, any, FieldValues>;
}>;

export function DateComponent({
	renderParams: {
		fieldPath,
		fieldSchema: {
			clientDateFormat = DEFAULT_CLIENT_DATE_FORMAT,
			disabled,
			displayDateFormat,
			label,
			hint,
			inputProps,
		},
		parents,
	},
	formResult: {
		control,
		formState: { errors },
	},
}: DateComponentProps): ReactElement {
	const { renderDatePicker, renderWrapper } = useUI();

	const error = renderError(get(errors, fieldPath));

	const wrapperParams = {
		error,
		hint,
		label,
	};

	return renderWrapper({
		...wrapperParams,
		children: (
			<Controller
				name={fieldPath}
				control={control}
				render={({ field }) =>
					renderDatePicker({
						disabled,
						displayDateFormat,
						name: fieldPath,
						inputProps: inputProps || {},
						onChange: (nextValue) => {
							field.onChange(
								nextValue ? serializeDate(nextValue, clientDateFormat) : null,
							);
						},
						value: parseValueAndValidate(field.value, clientDateFormat),
						wrapper: wrapperParams,
					}) as ReactElement
				}
			/>
		),
	}) as ReactElement;
}

export const date: FieldType<DateSchema> = {
	...(dateBase as unknown as FieldTypeBase<DateSchema>),

	render: (renderParams, formResult) => (
		<DateComponent renderParams={renderParams} formResult={formResult} />
	),
};
