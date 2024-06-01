import type { FieldType as FieldTypeBase } from "@vtaits/form-schema";
import { list as listBase } from "@vtaits/form-schema/fields/list";
import { useUI } from "@vtaits/react-form-schema-base-ui";
import get from "lodash/get";
import { Fragment, type ReactElement } from "react";
import {
	Controller,
	type FieldValues,
	type UseFormReturn,
	useFieldArray,
} from "react-hook-form";
import { type FieldType, type RenderParams, renderBySchema } from "../../core";
import { getFieldName } from "../base";
import { renderError } from "../base/renderError";
import type { ListSchema } from "./schema";

type ListComponentProps = Readonly<{
	renderParams: RenderParams<ListSchema, any, any, any, any, any>;
	formResult: UseFormReturn<FieldValues, any, FieldValues>;
}>;

export function ListComponent({
	renderParams: {
		fieldSchema: { addButtonLabel, getBlockLabel, initialItem, label, hint },
		getFieldSchema,
		getFieldType,
		name: nameParam,
		parents,
	},
	formResult: {
		cleanErrors,
		control,
		formState: { errors },
		register,
	},
}: ListComponentProps): ReactElement {
	const { renderListAddButton, renderListItemWrapper, renderListWrapper } =
		useUI();

	const name = getFieldName(nameParam, parents);
	const error = renderError(get(errors, name));

	const { append, fields, remove } = useFieldArray({
		control,
		name,
	});

	const wrapperParams = {
		error,
		hint,
		label,
	};

	return renderListWrapper({
		...wrapperParams,
		actions: renderListAddButton({
			children: addButtonLabel,
			onClick: () => {
				append(initialItem || {});
				cleanErrors(name);
			},
		}),
		items: fields.map((field, index) => {
			const itemParents = [
				...parents,
				{
					name: nameParam,
					values: fields,
				},
				{
					name: index,
					value: field,
				},
			];

			return (
				<Fragment key={field.id}>
					{renderListItemWrapper({
						children: renderBySchema(
							formResult,
							getFieldSchema,
							getFieldType,
							() => field,
							`${index}`,
							undefined,
							itemParents,
						),
						handleRemove: () => {
							remove(index);
							clearErrors(name);
						},
						title: getBlockLabel?.(index),
					})}
				</Fragment>
			);
		}),
	}) as ReactElement;
}

export const list: FieldType<ListSchema> = {
	...(listBase as unknown as FieldTypeBase<ListSchema>),

	render: (renderParams, formResult) => (
		<ListComponent renderParams={renderParams} formResult={formResult} />
	),
};
