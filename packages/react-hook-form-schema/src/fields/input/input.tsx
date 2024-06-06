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
import { renderError } from "../base/renderError";
import type { InputSchema } from "./schema";

type InputComponentProps = Readonly<{
	renderParams: RenderParams<InputSchema, any, any, any, any, any>;
	formResult: UseFormReturn<FieldValues, any, FieldValues>;
}>;

export function InputComponent({
	renderParams: {
		fieldPath,
		fieldSchema: { disabled, options, inputProps, hint, label },
		parents,
	},
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
						onChange: field.onChange,
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
