import type { ParentType } from "@vtaits/form-schema";
import { useCallback, useMemo } from "react";
import type { ReactElement } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

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
	renderParams: { fieldSchema, getFieldSchema, getFieldType },
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
	const { schemas, render = defaultRender } =
		fieldSchema as unknown as SetSchema<FieldSchema>;

	const names = useMemo(() => Object.keys(schemas), [schemas]);

	const { getValues } = formResult;

	const renderField = useCallback(
		(
			name: string,
			payload?: Payload,
			parents?: readonly ParentType<Values>[],
		) =>
			renderBySchema(
				formResult,
				getFieldSchema,
				getFieldType,
				getValues,
				name,
				payload,
				parents,
			),
		[formResult, getFieldSchema, getFieldType, getValues],
	);

	return render(renderField, names) as ReactElement;
}
