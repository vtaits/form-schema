import type { FieldSchemaBase } from "@vtaits/form-schema";
import { isEqual } from "es-toolkit";
import type { ReactElement } from "react";
import { useEffect, useRef, useState } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import useLatest from "use-latest";
import { type RenderParams, renderBySchema } from "../../core";
import type { DynamicSchema } from "./schema";

export type DynamicFieldProps<
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

export function DynamicField<
	FieldSchema extends FieldSchemaBase,
	Values extends FieldValues,
	RawValues extends FieldValues,
	SerializedValues extends FieldValues,
	Errors extends Record<string, any>,
	Payload,
	TContext,
>({
	renderParams: {
		name,
		fieldSchema,
		getFieldSchema,
		getFieldType,
		parents,
		payload,
	},
	formResult,
	formResult: { getValues },
}: DynamicFieldProps<
	FieldSchema,
	Values,
	RawValues,
	SerializedValues,
	Errors,
	Payload,
	TContext
>): ReactElement | null {
	const formResultRef = useLatest(formResult);

	const { getDependencies, getSchema, getSchemaAsync, onShow, onHide } =
		fieldSchema as unknown as DynamicSchema<
			FieldSchema,
			Values,
			RawValues,
			SerializedValues,
			Errors
		>;

	const onShowRef = useLatest(onShow);
	const onHideRef = useLatest(onHide);

	const dependencies = getDependencies({
		values: formResult.watch(),
		phase: "render",
		getFieldSchema,
		getFieldType,
		parents,
	});

	const prevDependenciesRef = useRef(dependencies);

	const [schema, setSchema] = useState(() => {
		if (getSchemaAsync) {
			return null;
		}

		return getSchema({
			dependencies,
			values: formResult.getValues(),
			phase: "render",
			getFieldSchema,
			getFieldType,
			parents,
		});
	});

	const isFirstRenderCheckDependenciesRef = useRef(true);

	// biome-ignore lint/correctness/useExhaustiveDependencies: trigger only on dependencies change
	useEffect(() => {
		if (isFirstRenderCheckDependenciesRef.current) {
			if (getSchemaAsync) {
				getSchemaAsync({
					dependencies,
					values: formResult.getValues(),
					phase: "render",
					getFieldSchema,
					getFieldType,
					parents,
				}).then((asyncSchema) => {
					setSchema(asyncSchema);
				});
			}

			isFirstRenderCheckDependenciesRef.current = false;
			return;
		}

		if (!isEqual(prevDependenciesRef.current, dependencies)) {
			if (getSchemaAsync) {
				getSchemaAsync({
					dependencies,
					values: formResult.getValues(),
					phase: "render",
					getFieldSchema,
					getFieldType,
					parents,
				}).then((asyncSchema) => {
					setSchema(asyncSchema);
				});
			} else {
				setSchema(
					getSchema({
						dependencies,
						values: formResult.getValues(),
						phase: "render",
						getFieldSchema,
						getFieldType,
						parents,
					}),
				);
			}

			prevDependenciesRef.current = dependencies;
		}
	}, [dependencies]);

	const schemaRef = useLatest(schema);

	const isFirstRenderRef = useRef(true);

	const hasSchema = Boolean(schema);

	// biome-ignore lint/correctness/useExhaustiveDependencies: should only be called on toggle
	useEffect(() => {
		if (isFirstRenderRef.current) {
			isFirstRenderRef.current = false;
			return;
		}

		if (hasSchema) {
			if (onShowRef.current) {
				const currentSchema = schemaRef.current;

				if (!currentSchema) {
					throw new Error("[react-hook-form-schema] schema is not defined");
				}

				onShowRef.current(
					formResultRef.current,
					name,
					currentSchema,
					getFieldSchema,
					getFieldType,
					parents,
				);
			}

			return;
		}

		if (onHideRef.current) {
			onHideRef.current(
				formResultRef.current,
				name,
				getFieldSchema,
				getFieldType,
				parents,
			);

			return;
		}

		isFirstRenderRef.current = true;
	}, [
		formResultRef,
		getFieldSchema,
		getFieldType,
		hasSchema,
		name,
		onHideRef,
		onShowRef,
		schemaRef,
	]);

	if (!schema) {
		return null;
	}

	return renderBySchema(
		formResult,
		getFieldSchema,
		getFieldType,
		getValues,
		name,
		payload,
		parents,
	) as ReactElement;
}
