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
import { wrapOnChange } from "../base";
import { renderError } from "../base/renderError";
import type { DateTimeSchema } from "./schema";

type DateTimeComponentProps = Readonly<{
	renderParams: RenderParams<DateTimeSchema, any, any, any, any, any>;
	formResult: UseFormReturn<FieldValues, any, FieldValues>;
}>;

export function DateTimeComponent({
	renderParams: {
		fieldPath,
		fieldSchema: {
			clientDateFormat = DEFAULT_CLIENT_DATE_FORMAT,
			disabled,
			displayDateFormat = DEFAULT_DISPLAY_DATE_FORMAT,
			autoFocus,
			label,
			hint,
			inputProps,
			onChange = undefined,
			required,
		},
	},
	formResult,
	formResult: {
		control,
		formState: { errors },
	},
}: DateTimeComponentProps): ReactElement {
	const { renderDateTimePicker, renderWrapper } = useUI();

	const error = renderError(get(errors, fieldPath));

	const wrapperParams = {
		error,
		hint,
		label,
		name: fieldPath,
		required,
	};

	return renderWrapper({
		...wrapperParams,
		children: (
			<Controller
				name={fieldPath}
				control={control}
				render={({ field }) => {
					const wrappedOnChange = wrapOnChange(
						field.onChange,
						onChange,
						formResult,
						field.value,
					);

					return renderDateTimePicker({
						disabled,
						displayDateFormat,
						name: fieldPath,
						inputProps: inputProps || {},
						autoFocus,
						onChange: (nextValue) => {
							wrappedOnChange(
								nextValue ? serializeDate(nextValue, clientDateFormat) : null,
							);
						},
						value: parseValueAndValidate(field.value, clientDateFormat),
						wrapper: wrapperParams,
					}) as ReactElement;
				}}
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
