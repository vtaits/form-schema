import type { FieldType as FieldTypeBase } from "@vtaits/form-schema";
import { file as fileBase } from "@vtaits/form-schema/fields/file";
import type { FileFieldValue } from "@vtaits/form-schema/fields/file";
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
import type { FileSchema } from "./schema";

type FileComponentProps = Readonly<{
	renderParams: RenderParams<FileSchema, any, any, any, any, any>;
	formResult: UseFormReturn<FieldValues, any, FieldValues>;
}>;

export function FileComponent({
	renderParams: {
		fieldPath,
		fieldSchema: {
			disabled,
			accept,
			text = "Select file",
			hint,
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
}: FileComponentProps): ReactElement {
	const { renderFileInput, renderWrapper } = useUI();

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

					return renderFileInput({
						accept,
						children: text,
						disabled,
						onSelectFile: (nextFile: Blob | null) => {
							const prevValue = (field.value || {
								file: null,
							}) as FileFieldValue;

							wrappedOnChange({
								...prevValue,
								file: nextFile,
								name: nextFile instanceof File ? nextFile.name : undefined,
							});
						},
						name: fieldPath,
						wrapper: wrapperParams,
					}) as ReactElement;
				}}
			/>
		),
	}) as ReactElement;
}

export const file: FieldType<FileSchema> = {
	...(fileBase as unknown as FieldTypeBase<FileSchema>),

	render: (renderParams, formResult) => (
		<FileComponent renderParams={renderParams} formResult={formResult} />
	),
};
