import type { FieldType as FieldTypeBase } from "@vtaits/form-schema";
import { list as listBase } from "@vtaits/form-schema/fields/list";
import { useUI } from "@vtaits/react-form-schema-base-ui";
import get from "lodash/get";
import { Fragment, type ReactElement } from "react";
import {
	type FieldValues,
	type UseFormReturn,
	useFieldArray,
} from "react-hook-form";
import { type FieldType, type RenderParams, renderBySchema } from "../../core";
import { renderError } from "../base/renderError";
import type { ListSchema } from "./schema";

type ListComponentProps<FieldSchema> = Readonly<{
	renderParams: RenderParams<ListSchema<FieldSchema>, any, any, any, any, any>;
	formResult: UseFormReturn<FieldValues, any, FieldValues>;
}>;

export function ListComponent<FieldSchema>({
	renderParams: {
		fieldPath,
		fieldSchema: {
			addButtonLabel = "Add",
			disabled,
			getBlockLabel,
			initialItem,
			label,
			hint,
			renderListItemWrapper: renderListItemWrapperParam,
		},
		getFieldSchema,
		getFieldType,
		name: nameParam,
		parents,
	},
	formResult,
	formResult: {
		clearErrors,
		control,
		formState: { errors },
	},
}: ListComponentProps<FieldSchema>): ReactElement {
	const {
		renderListAddButton,
		renderListItemWrapper: renderListItemWrapperBase,
		renderListWrapper,
	} = useUI();

	const renderListItemWrapper =
		renderListItemWrapperParam || renderListItemWrapperBase;

	const error = renderError(get(errors, fieldPath));

	const { append, fields, remove } = useFieldArray({
		control,
		name: fieldPath,
	});

	const wrapperParams = {
		error,
		hint,
		label,
	};

	const itemParents = [
		...parents,
		{
			name: nameParam,
			values: fields,
		},
	];

	return renderListWrapper({
		...wrapperParams,
		actions: renderListAddButton({
			disabled,
			children: addButtonLabel,
			onClick: () => {
				append(initialItem || {});
				clearErrors(fieldPath);
			},
		}),
		items: fields.map((field, index) => {
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
						disabled,
						handleRemove: () => {
							remove(index);
							clearErrors(fieldPath);
						},
						title: getBlockLabel?.(index),
					})}
				</Fragment>
			);
		}),
	}) as ReactElement;
}

export const list: FieldType<ListSchema<any>> = {
	...(listBase as unknown as FieldTypeBase<ListSchema<any>>),

	render: (renderParams, formResult) => (
		<ListComponent renderParams={renderParams} formResult={formResult} />
	),
};
