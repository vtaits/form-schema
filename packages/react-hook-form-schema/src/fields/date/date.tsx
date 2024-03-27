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
import { getFieldName } from "../base";
import { renderError } from "../base/renderError";
import type { DateSchema } from "./schema";

type DateComponentProps = Readonly<{
	renderParams: RenderParams<DateSchema, any, any, any, any, any>;
	formResult: UseFormReturn<FieldValues, any, FieldValues>;
}>;

export function DateComponent({
	renderParams: {
		fieldSchema: {
			clientDateFormat = DEFAULT_CLIENT_DATE_FORMAT,
			displayDateFormat,
			label,
			hint,
			inputProps,
		},
		name: nameParam,
		parents,
	},
	formResult: {
		control,
		formState: { errors },
	},
}: DateComponentProps): ReactElement {
	const { renderDatePicker, renderWrapper } = useUI();

	const name = getFieldName(nameParam, parents);
	const error = renderError(get(errors, name));

	const wrapperParams = {
		error,
		hint,
		label,
	};

	return renderWrapper({
		...wrapperParams,
		children: (
			<Controller
				name={name}
				control={control}
				render={({ field }) =>
					renderDatePicker({
						displayDateFormat,
						name,
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
