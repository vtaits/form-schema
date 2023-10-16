import { useEffect, useRef } from "react";
import type { ReactElement } from "react";
import { useForm, useFormState } from "react-final-form";

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

	const schema = getSchema(
		values,
		"render",
		getFieldSchema,
		getFieldType,
		parents,
	);

	const isFirstRenderRef = useRef(true);

	useEffect(() => {
		if (isValuesReady) {
			if (isFirstRenderRef.current) {
				isFirstRenderRef.current = false;
				return;
			}

			if (schema) {
				if (onShow) {
					onShow(form, name, schema, getFieldSchema, getFieldType, parents);
				}

				return;
			}

			if (onHide) {
				onHide(form, name, getFieldSchema, getFieldType, parents);

				return;
			}

			isFirstRenderRef.current = true;
		}
	}, [Boolean(schema)]);

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
