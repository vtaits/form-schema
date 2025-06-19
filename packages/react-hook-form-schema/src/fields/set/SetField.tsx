import type { ReactElement } from "react";
import { useMemo } from "react";
import {
	Controller,
	type FieldValues,
	type Path,
	type UseFormReturn,
} from "react-hook-form";
import {
	type FieldSchemaWithRenderBase,
	type RenderParams,
	renderBySchema,
} from "../../core";
import { defaultRender } from "./defaultRender";
import type { SetSchema } from "./schema";

function getRenderPath(payload: unknown) {
	if (!payload) {
		return null;
	}

	const renderPath = (payload as Record<string, unknown>).renderPath;

	if (!Array.isArray(renderPath)) {
		return null;
	}

	if (typeof renderPath[0] !== "string") {
		throw new Error(
			`[set] \`renderPath\` should be an array of strings, received: \`${renderPath[0]}\``,
		);
	}

	return renderPath as string[];
}

export type SetFieldProps<
	FieldSchema extends FieldSchemaWithRenderBase,
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
	FieldSchema extends FieldSchemaWithRenderBase,
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
		payload,
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
		renderSet = defaultRender,
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

				const renderPath = getRenderPath(payload);

				if (renderPath) {
					const [fieldName, ...restPath] = renderPath;

					return renderField(fieldName, {
						...payload,
						renderPath: restPath,
					} as Payload) as ReactElement;
				}

				return renderSet(renderField, names) as ReactElement;
			}}
		/>
	);
}
