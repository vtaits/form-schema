import type { ParentType } from "@vtaits/form-schema";
import { useCallback, useMemo } from "react";
import type { ReactElement } from "react";
import {
	Controller,
	type FieldValues,
	type Path,
	type UseFormReturn,
} from "react-hook-form";
import { type RenderParams, renderBySchema } from "../../core";
import { defaultRender } from "./defaultRender";
import type { SetSchema } from "./schema";

export type SetFieldProps<
	FieldSchema,
	Values extends FieldValues,
	RawValues extends FieldValues,
	SerializedValues extends FieldValues,
	Errors extends Record<string, any>,
	Payload,
	TContext,
> = {
	renderParams: RenderParams<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors,
		Payload
	>;
	formResult: UseFormReturn<Values, TContext, Values>;
};

export function SetField<
	FieldSchema,
	Values extends FieldValues,
	RawValues extends FieldValues,
	SerializedValues extends FieldValues,
	Errors extends Record<string, any>,
	Payload,
	TContext,
>({
	renderParams: {
		fieldPath,
		fieldSchema,
		getFieldSchema,
		getFieldType,
		name: nameParam,
		parents,
	},
	formResult,
}: SetFieldProps<
	FieldSchema,
	Values,
	RawValues,
	SerializedValues,
	Errors,
	Payload,
	TContext
>): ReactElement | null {
	const {
		nested,
		schemas,
		render = defaultRender,
	} = fieldSchema as unknown as SetSchema<FieldSchema>;

	const names = useMemo(() => Object.keys(schemas), [schemas]);

	const { control, getValues } = formResult;

	return (
		<Controller
			name={fieldPath as Path<Values>}
			control={control}
			render={({ field }) => {
				const providedParents = nested
					? [
							...parents,
							{
								name: nameParam,
								values: field.value,
							},
						]
					: parents;

				const renderField = (childName: string, payload?: Payload) =>
					renderBySchema(
						formResult,
						getFieldSchema,
						getFieldType,
						getValues,
						childName,
						payload,
						providedParents,
					);

				return render(renderField, names) as ReactElement;
			}}
		/>
	);
}
