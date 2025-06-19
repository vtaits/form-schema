import type { FieldType as FieldTypeBase } from "@vtaits/form-schema";
import { input as inputBase } from "@vtaits/form-schema/fields/input";
import { useUI } from "@vtaits/react-form-schema-base-ui";
import type { ReactElement } from "react";
import {
	Controller,
	type FieldValues,
	get,
	type UseFormReturn,
} from "react-hook-form";
import type { FieldType, RenderParams } from "../../core";
import { wrapOnChange } from "../base";
import { renderError } from "../base/renderError";
import type { TextAreaSchema } from "./schema";

type TextAreaComponentProps = Readonly<{
	renderParams: RenderParams<TextAreaSchema, any, any, any, any, any>;
	formResult: UseFormReturn<FieldValues, any, FieldValues>;
}>;

export function TextAreaComponent({
	renderParams: {
		fieldPath,
		fieldSchema: {
			disabled,
			hint,
			autoFocus,
			label,
			onChange = undefined,
			required,
			textAreaProps,
		},
	},
	formResult,
	formResult: {
		control,
		formState: { errors },
	},
}: TextAreaComponentProps): ReactElement {
	const { renderTextArea, renderWrapper } = useUI();

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
						field.value || "",
					);

					return renderTextArea({
						disabled,
						name: fieldPath,
						autoFocus,
						textAreaProps: {
							...textAreaProps,
							value: field.value || "",
							onChange: (e) => {
								wrappedOnChange(e.currentTarget.value);
							},
						},
						wrapper: wrapperParams,
					}) as ReactElement;
				}}
			/>
		),
	}) as ReactElement;
}

export const textarea: FieldType<TextAreaSchema> = {
	...(inputBase as unknown as FieldTypeBase<TextAreaSchema>),

	render: (renderParams, formResult) => (
		<TextAreaComponent renderParams={renderParams} formResult={formResult} />
	),
};
