import type { FieldType as FieldTypeBase } from "@vtaits/form-schema";
import { checkbox as checkboxBase } from "@vtaits/form-schema/fields/checkbox";
import { useUI } from "@vtaits/react-form-schema-base-ui";
import type { ReactElement } from "react";
import {
	Controller,
	type FieldValues,
	get,
	type UseFormReturn,
} from "react-hook-form";
import type { FieldType, RenderParams } from "../../core";
import { renderError, wrapOnChange } from "../base";
import type { CheckboxSchema } from "./schema";

type CheckboxComponentProps = Readonly<{
	renderParams: RenderParams<CheckboxSchema, any, any, any, any, any>;
	formResult: UseFormReturn<FieldValues, any, FieldValues>;
}>;

export function CheckboxComponent({
	renderParams: {
		fieldPath,
		fieldSchema: {
			checkboxLabel,
			disabled,
			hint,
			autoFocus,
			label,
			onChange = undefined,
			required,
		},
	},
	formResult,
	formResult: {
		control,
		formState: { errors },
	},
}: CheckboxComponentProps): ReactElement {
	const { renderCheckbox, renderWrapper } = useUI();

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
					const booleanValue = Boolean(field.value);

					return renderCheckbox({
						children: checkboxLabel,
						disabled,
						checked: booleanValue,
						autoFocus,
						name: fieldPath,
						onChange: wrapOnChange(
							field.onChange,
							onChange,
							formResult,
							booleanValue,
						),
						wrapper: wrapperParams,
					}) as ReactElement;
				}}
			/>
		),
	}) as ReactElement;
}

export const checkbox: FieldType<CheckboxSchema> = {
	...(checkboxBase as FieldTypeBase<CheckboxSchema>),

	render: (renderParams, formResult) => (
		<CheckboxComponent renderParams={renderParams} formResult={formResult} />
	),
};
