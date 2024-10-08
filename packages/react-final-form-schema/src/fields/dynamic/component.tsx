import type { FieldSchemaBase } from "@vtaits/form-schema";
import { useEffect, useRef } from "react";
import type { ReactElement } from "react";
import { useForm, useFormState } from "react-final-form";
import useLatest from "use-latest";
import {
	type FieldComponentProps,
	FormField,
	useFormSchemaState,
} from "../../core";
import type { DynamicSchema } from "./schema";

export function DynamicField<
	FieldSchema extends FieldSchemaBase,
	Values extends Record<string, any>,
	RawValues extends Record<string, any>,
	SerializedValues extends Record<string, any>,
	Errors extends Record<string, any>,
	Payload,
>({
	name,
	fieldSchema,
	getFieldSchema,
	getFieldType,
	parents,
}: FieldComponentProps<
	FieldSchema,
	Values,
	RawValues,
	SerializedValues,
	Errors,
	Payload
>): ReactElement | null {
	const form = useForm<Values>();

	const { values } = useFormState<Values, Values>();

	const { isValuesReady } = useFormSchemaState();

	const { getSchema, onShow, onHide } = fieldSchema as unknown as DynamicSchema<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors
	>;

	const onShowRef = useLatest(onShow);
	const onHideRef = useLatest(onHide);

	const schema = getSchema(
		values,
		"render",
		getFieldSchema,
		getFieldType,
		parents,
	);

	const schemaRef = useLatest(schema);

	const isFirstRenderRef = useRef(true);

	const hasSchema = Boolean(schema);

	// biome-ignore lint/correctness/useExhaustiveDependencies: should only be called on toggle
	useEffect(() => {
		if (isValuesReady) {
			if (isFirstRenderRef.current) {
				isFirstRenderRef.current = false;
				return;
			}

			if (hasSchema) {
				const currentSchema = schemaRef.current;

				if (!currentSchema) {
					throw new Error("[react-final-form-schema] schema is not defined");
				}

				if (onShowRef.current) {
					onShowRef.current(
						form,
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
				onHideRef.current(form, name, getFieldSchema, getFieldType, parents);

				return;
			}

			isFirstRenderRef.current = true;
		}
	}, [hasSchema, name, isValuesReady, onHideRef, onShowRef, schemaRef]);

	if (!schema) {
		return null;
	}

	return <FormField name={name} />;
}
