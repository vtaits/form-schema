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
import type { TextAreaSchema } from "./schema";

type TextAreaComponentProps = Readonly<{
	renderParams: RenderParams<TextAreaSchema, any, any, any, any, any>;
	formResult: UseFormReturn<FieldValues, any, FieldValues>;
}>;

export function TextAreaComponent({
	renderParams: {
		fieldPath,
		fieldSchema: { label, hint, textAreaProps },
		parents,
	},
	formResult: {
		control,
		formState: { errors },
		register,
	},
}: TextAreaComponentProps): ReactElement {
	const { renderTextArea, renderWrapper } = useUI();

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
					renderTextArea({
						name: fieldPath,
						textAreaProps: {
							...textAreaProps,
							value: field.value || "",
							onChange: (e) => {
								field.onChange(e.currentTarget.value);
							},
						},
						wrapper: wrapperParams,
					}) as ReactElement
				}
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
