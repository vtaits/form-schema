import type {
	FieldType as FieldTypeBase,
	GetFieldSchema,
	ParentType,
} from "@vtaits/form-schema";

import type { Config } from "final-form";
import type {
	FormProps as FinalFormProps,
	RenderableProps,
} from "react-final-form";

import type { ComponentType, ReactNode } from "react";

export type GetFieldType<
	FieldSchema,
	Values extends Record<string, any> = Record<string, any>,
	RawValues extends Record<string, any> = Record<string, any>,
	SerializedValues extends Record<string, any> = Record<string, any>,
	Errors extends Record<string, any> = Record<string, any>,
	Payload = any,
> = (
	fieldSchema: FieldSchema,
) => FieldType<
	FieldSchema,
	Values,
	RawValues,
	SerializedValues,
	Errors,
	Payload
>;

export type RenderField<
	Values extends Record<string, any> = Record<string, any>,
	Payload = any,
> = (
	name: string,
	payload?: Payload,
	parents?: ParentType<Values>[],
) => ReactNode;

export type FieldComponentProps<
	FieldSchema,
	Values extends Record<string, any> = Record<string, any>,
	RawValues extends Record<string, any> = Record<string, any>,
	SerializedValues extends Record<string, any> = Record<string, any>,
	Errors extends Record<string, any> = Record<string, any>,
	Payload = any,
> = {
	name: string;
	fieldSchema: FieldSchema;
	payload?: Payload;
	getFieldSchema: GetFieldSchema<FieldSchema>;
	getFieldType: GetFieldType<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors,
		Payload
	>;
	/**
	 * stack of parent fields above current field with runtime values
	 */
	parents: ParentType<Values>[];
};

export type MapErrors<
	Values extends Record<string, any> = Record<string, any>,
	SerializedValues extends Record<string, any> = Record<string, any>,
	Errors extends Record<string, any> = Record<string, any>,
> = (
	rawErrors: Errors,
	valuesForSubmit: SerializedValues,
	values: Values,
) => Errors;

export type FieldType<
	FieldSchema,
	Values extends Record<string, any> = Record<string, any>,
	RawValues extends Record<string, any> = Record<string, any>,
	SerializedValues extends Record<string, any> = Record<string, any>,
	Errors extends Record<string, any> = Record<string, any>,
	Payload = any,
> = FieldTypeBase<FieldSchema, Values, RawValues, SerializedValues, Errors> & {
	component: ComponentType<
		FieldComponentProps<
			FieldSchema,
			Values,
			RawValues,
			SerializedValues,
			Errors,
			Payload
		>
	>;
};

/**
 * Remove [otherProp: string]: any
 */
type FinalFormPropsPure<
	FormValues = Record<string, any>,
	InitialFormValues = Partial<FormValues>,
> = Pick<
	FinalFormProps<FormValues, InitialFormValues>,
	| keyof Config
	| keyof RenderableProps<any>
	| "subscription"
	| "decorators"
	| "form"
	| "initialValuesEqual"
>;

export type FormProps<
	FieldSchema,
	Values extends Record<string, any> = Record<string, any>,
	RawValues extends Record<string, any> = Record<string, any>,
	SerializedValues extends Record<string, any> = Record<string, any>,
	Errors extends Record<string, any> = Record<string, any>,
	Payload = any,
> = Omit<FinalFormPropsPure<Values, Values>, "onSubmit" | "initialValues"> & {
	/**
	 * placeholder runtime values of form during asynchronous initialization
	 */
	initialValuesPlaceholder?: Values;
	initialValues?: RawValues;

	names: string[];
	getFieldSchema?: GetFieldSchema<FieldSchema>;
	getFieldType: GetFieldType<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors,
		Payload
	>;

	mapErrors?: MapErrors<Values, SerializedValues, Errors>;

	onSubmit: (
		serializedValues: SerializedValues,
		rawValues: Values,
	) => ReturnType<FinalFormPropsPure<Values, Values>["onSubmit"]>;
};

export type FormSchemaStateContextType = {
	/**
	 * If parsing if asynchronous it returns true only after end of parsing
	 * If parsing if synchronous it always returns true
	 */
	isValuesReady: boolean;
};

export type FormSchemaContextType<
	FieldSchema,
	Values extends Record<string, any> = Record<string, any>,
	RawValues extends Record<string, any> = Record<string, any>,
	SerializedValues extends Record<string, any> = Record<string, any>,
	Errors extends Record<string, any> = Record<string, any>,
	Payload = any,
> = {
	getFieldSchema: GetFieldSchema<FieldSchema>;
	getFieldType: GetFieldType<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors,
		Payload
	>;
};

export type FormFieldContextType<FieldSchema,> = {
	getFieldSchema: GetFieldSchema<FieldSchema>;
};
