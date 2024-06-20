import type { FieldType as FieldTypeBase } from "@vtaits/form-schema";
import { checkbox as checkboxBase } from "@vtaits/form-schema/fields/checkbox";
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
import type { CheckboxSchema } from "./schema";

type CheckboxComponentProps = Readonly<{
	renderParams: RenderParams<CheckboxSchema, any, any, any, any, any>;
	formResult: UseFormReturn<FieldValues, any, FieldValues>;
}>;

export function CheckboxComponent({
	renderParams: {
		fieldPath,
		fieldSchema: { checkboxLabel, disabled, hint, autoFocus, label },
	},
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
	};

	return renderWrapper({
		...wrapperParams,
		children: (
			<Controller
				name={fieldPath}
				control={control}
				render={({ field }) =>
					renderCheckbox({
						children: checkboxLabel,
						disabled,
						checked: Boolean(field.value),
						autoFocus,
						name: fieldPath,
						onChange: field.onChange,
						wrapper: wrapperParams,
					}) as ReactElement
				}
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
