import { useEffect, useRef } from "react";
import type { ReactElement } from "react";
import { useForm, useFormState } from "react-final-form";
import useLatest from "use-latest";

import { useFormSchemaState } from "../../core";

import type { FieldComponentProps } from "../../core";

import type { DynamicSchema } from "./schema";

export type DynamicFieldProps<
	FieldSchema,
	Values extends Record<string, any>,
	RawValues extends Record<string, any>,
	SerializedValues extends Record<string, any>,
	Errors extends Record<string, any>,
	Payload,
> = FieldComponentProps<
	FieldSchema,
	Values,
	RawValues,
	SerializedValues,
	Errors,
	Payload
>;

export function DynamicField<
	FieldSchema,
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
	...rest
}: DynamicFieldProps<
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

	useEffect(() => {
		if (isValuesReady) {
			if (isFirstRenderRef.current) {
				isFirstRenderRef.current = false;
				return;
			}

			if (hasSchema) {
				if (onShowRef.current) {
					onShowRef.current(
						form,
						name,
						schemaRef.current,
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
	}, [
		form,
		getFieldSchema,
		getFieldType,
		hasSchema,
		isValuesReady,
		name,
		onHideRef,
		onShowRef,
		parents,
		schemaRef,
	]);

	if (!schema) {
		return null;
	}

	const fieldType = getFieldType(schema);

	const { component: FieldComponent } = fieldType;

	return (
		<FieldComponent
			{...rest}
			name={name}
			fieldSchema={schema}
			getFieldSchema={getFieldSchema}
			getFieldType={getFieldType}
			parents={parents}
		/>
	);
}
