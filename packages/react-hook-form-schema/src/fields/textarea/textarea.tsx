import type { FieldType as FieldTypeBase } from "@vtaits/form-schema";
import { input as inputBase } from "@vtaits/form-schema/fields/input";
import { useUI } from "@vtaits/react-form-schema-base-ui";
import get from "lodash/get";
import type { ReactElement } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import type { FieldType, RenderParams } from "../../core";
import { getFieldName } from "../base";
import type { TextAreaSchema } from "./schema";

type TextAreaComponentProps = Readonly<{
	renderParams: RenderParams<TextAreaSchema, any, any, any, any, any>;
	formResult: UseFormReturn<FieldValues, any, FieldValues>;
}>;

export function TextAreaComponent({
	renderParams: {
		fieldSchema: { label, hint, textAreaProps },
		name: nameParam,
		parents,
	},
	formResult: { formState: { errors }, register },
}: TextAreaComponentProps): ReactElement {
	const { renderTextArea, renderWrapper } = useUI();

	const name = getFieldName(nameParam, parents);
	const error = get(errors, name);

	const wrapperParams = {
		error,
		hint,
		label,
	};

	return renderWrapper({
		...wrapperParams,
		children: renderTextArea({
			name,
			textAreaProps: {
				...textAreaProps,
				...register(name),
			},
			wrapper: wrapperParams,
		}),
	}) as ReactElement;
}

export const textarea: FieldType<TextAreaSchema> = {
	...(inputBase as unknown as FieldTypeBase<TextAreaSchema>),

	render: (renderParams, formResult) => (
		<TextAreaComponent renderParams={renderParams} formResult={formResult} />
	),
};
