import type { GetFieldSchema, ParentType } from "@vtaits/form-schema";
import type { ReactNode } from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { getFieldPath } from "./getFieldPath";
import type { FieldSchemaWithRenderBase, GetFieldType } from "./types";

export function renderBySchema<
	FieldSchema extends FieldSchemaWithRenderBase,
	Values extends FieldValues = FieldValues,
	RawValues extends FieldValues = FieldValues,
	SerializedValues extends FieldValues = FieldValues,
	Errors extends Record<string, any> = Record<string, any>,
	Payload = any,
	TContext = any,
>(
	formResult: UseFormReturn<Values, TContext, Values>,
	getFieldSchema: GetFieldSchema<FieldSchema>,
	getFieldType: GetFieldType<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors,
		Payload,
		TContext
	>,
	getValues: () => FieldValues,
	name: string,
	payload?: Payload,
	parents?: readonly ParentType<Values>[],
): ReactNode {
	const fieldSchema = getFieldSchema(name);
	const fieldType = getFieldType(fieldSchema);

	const { createGetFieldSchema } = fieldType;

	const render =
		(fieldSchema.render as unknown as typeof fieldType.render) ||
		fieldType.render;

	const values = getValues() as Values;

	const providedParents = parents || [
		{
			values,
		},
	];

	const childGetFieldSchema: GetFieldSchema<FieldSchema> = createGetFieldSchema
		? createGetFieldSchema({
				fieldSchema,
				getFieldSchema,
				getFieldType,
				values,
				phase: "render",
				parents: providedParents,
			})
		: getFieldSchema;

	return render(
		{
			fieldPath: getFieldPath(name, providedParents) as Path<Values>,
			name,
			payload,
			parents: providedParents,
			getFieldSchema: childGetFieldSchema,
			getFieldType,
			fieldSchema,
		},
		formResult,
	);
}
