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
import { getFieldName } from "../base";
import { renderError } from "../base/renderError";
import type { InputSchema } from "./schema";

type InputComponentProps = Readonly<{
	renderParams: RenderParams<InputSchema, any, any, any, any, any>;
	formResult: UseFormReturn<FieldValues, any, FieldValues>;
}>;

export function InputComponent({
	renderParams: {
		fieldSchema: { label, hint, inputProps },
		name: nameParam,
		parents,
	},
	formResult: {
		control,
		formState: { errors },
	},
}: InputComponentProps): ReactElement {
	const { renderInput, renderWrapper } = useUI();

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
					renderInput({
						name,
						inputProps: {
							...inputProps,
							value: field.value || "",
							onChange: field.onChange,
						},
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
