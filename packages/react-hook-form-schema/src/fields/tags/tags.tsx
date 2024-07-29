import type { FieldType as FieldTypeBase } from "@vtaits/form-schema";
import { tags as tagsBase } from "@vtaits/form-schema/fields/tags";
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
import type { TagsSchema } from "./schema";

export function prepareValue(rawValue: unknown) {
	const arrayValue = rawValue
		? Array.isArray(rawValue)
			? rawValue
			: [rawValue]
		: [];

	return arrayValue.map((rawValue) => {
		if (typeof rawValue === "number" || typeof rawValue === "boolean") {
			return String(rawValue);
		}

		if (typeof rawValue === "string") {
			return rawValue;
		}

		return "";
	});
}

type TagsComponentProps = Readonly<{
	renderParams: RenderParams<TagsSchema, any, any, any, any, any>;
	formResult: UseFormReturn<FieldValues, any, FieldValues>;
}>;

export function TagsComponent({
	renderParams: {
		fieldPath,
		fieldSchema: { disabled, options, hint, autoFocus, label },
	},
	formResult: {
		control,
		formState: { errors },
	},
}: TagsComponentProps): ReactElement {
	const { renderTags, renderWrapper } = useUI();

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
					renderTags({
						disabled,
						autoFocus,
						name: fieldPath,
						value: prepareValue(field.value),
						onChange: field.onChange,
						options,
						wrapper: wrapperParams,
					}) as ReactElement
				}
			/>
		),
	}) as ReactElement;
}

export const tags: FieldType<TagsSchema> = {
	...(tagsBase as unknown as FieldTypeBase<TagsSchema>),

	render: (renderParams, formResult) => (
		<TagsComponent renderParams={renderParams} formResult={formResult} />
	),
};
