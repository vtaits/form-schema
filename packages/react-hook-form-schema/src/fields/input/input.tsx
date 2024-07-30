import type { FieldType as FieldTypeBase } from "@vtaits/form-schema";
import { input as inputBase } from "@vtaits/form-schema/fields/input";
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
import type { InputSchema } from "./schema";

type InputComponentProps = Readonly<{
	renderParams: RenderParams<InputSchema, any, any, any, any, any>;
	formResult: UseFormReturn<FieldValues, any, FieldValues>;
}>;

export function InputComponent({
	renderParams: {
		fieldPath,
		fieldSchema: {
			disabled,
			options,
			inputProps,
			hint,
			autoFocus,
			label,
			onChange = undefined,
		},
	},
	formResult,
	formResult: {
		control,
		formState: { errors },
	},
}: InputComponentProps): ReactElement {
	const { renderInput, renderWrapper } = useUI();

	const error = renderError(get(errors, fieldPath));

	const wrapperParams = {
		error,
		hint,
		label,
		name: fieldPath,
	};

	return renderWrapper({
		...wrapperParams,
		children: (
			<Controller
				name={fieldPath}
				control={control}
				render={({ field }) =>
					renderInput({
						disabled,
						name: fieldPath,
						inputProps: {
							...inputProps,
							value: field.value || "",
						},
						autoFocus,
						onChange: wrapOnChange(
							field.onChange,
							onChange,
							formResult,
							field.value,
						),
						options,
						wrapper: wrapperParams,
					}) as ReactElement
				}
			/>
		),
	}) as ReactElement;
}

export const input: FieldType<InputSchema> = {
	...(inputBase as unknown as FieldTypeBase<InputSchema>),

	render: (renderParams, formResult) => (
		<InputComponent renderParams={renderParams} formResult={formResult} />
	),
};
