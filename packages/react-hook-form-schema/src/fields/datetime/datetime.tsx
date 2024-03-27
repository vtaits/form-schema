import type { FieldType as FieldTypeBase } from "@vtaits/form-schema";
import {
	parseValueAndValidate,
	serializeDate,
} from "@vtaits/form-schema/fields/date-base";
import {
	DEFAULT_CLIENT_DATE_FORMAT,
	DEFAULT_DISPLAY_DATE_FORMAT,
	datetime as datetimeBase,
} from "@vtaits/form-schema/fields/datetime";
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
import type { DateTimeSchema } from "./schema";

type DateTimeComponentProps = Readonly<{
	renderParams: RenderParams<DateTimeSchema, any, any, any, any, any>;
	formResult: UseFormReturn<FieldValues, any, FieldValues>;
}>;

export function DateTimeComponent({
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
}: DateTimeComponentProps): ReactElement {
	const { renderDateTimePicker, renderWrapper } = useUI();

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
					renderDateTimePicker({
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

export const datetime: FieldType<DateTimeSchema> = {
	...(datetimeBase as unknown as FieldTypeBase<DateTimeSchema>),

	render: (renderParams, formResult) => (
		<DateTimeComponent renderParams={renderParams} formResult={formResult} />
	),
};
