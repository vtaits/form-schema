import type {
	BaseValues,
	FieldSchemaBase,
	FieldType as FieldTypeBase,
	GetFieldSchema,
	ParentType,
} from "@vtaits/form-schema";
import type { BaseSyntheticEvent, ReactNode } from "react";
import type {
	FieldValues,
	Path,
	SubmitErrorHandler,
	UseFormProps,
	UseFormReturn,
} from "react-hook-form";

export type MapErrors<
	Values extends FieldValues = FieldValues,
	SerializedValues extends FieldValues = FieldValues,
	Errors extends Record<string, any> = Record<string, any>,
> = (
	rawErrors: Errors,
	valuesForSubmit: SerializedValues,
	values: Values,
) => Errors;

export type RenderParams<
	FieldSchema,
	Values extends FieldValues = FieldValues,
	RawValues extends FieldValues = FieldValues,
	SerializedValues extends FieldValues = FieldValues,
	Errors extends Record<string, any> = Record<string, any>,
	Payload = any,
> = Readonly<{
	/**
	 * Current name of the field on the level. For example:
	 *
	 * `fieldPath === "group.list.0.input"`
	 * `name === "input"`
	 */
	name: string;
	/**
	 * Full path to the field from root. For example:
	 *
	 * `fieldPath === "group.list.0.input"`
	 * `name === "input"`
	 */
	fieldPath: Path<Values>;
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
	parents: readonly ParentType<Values>[];
}>;

export type FieldType<
	FieldSchema,
	Values extends FieldValues = FieldValues,
	RawValues extends FieldValues = FieldValues,
	SerializedValues extends FieldValues = FieldValues,
	Errors extends Record<string, any> = Record<string, any>,
	Payload = any,
	TContext = any,
> = Readonly<
	FieldTypeBase<FieldSchema, Values, RawValues, SerializedValues, Errors> & {
		render: (
			renderParams: RenderParams<
				FieldSchema,
				Values,
				RawValues,
				SerializedValues,
				Errors,
				Payload
			>,
			formResult: UseFormReturn<Values, TContext, Values>,
		) => ReactNode;
	}
>;

export type FieldSchemaWithRenderBase = FieldSchemaBase & {
	render?: (
		renderParams: RenderParams<
			FieldSchemaWithRenderBase,
			BaseValues,
			BaseValues,
			BaseValues
		>,
		formResult: UseFormReturn<BaseValues, any, BaseValues>,
	) => ReactNode;
};

export type GetFieldType<
	FieldSchema,
	Values extends FieldValues = FieldValues,
	RawValues extends FieldValues = FieldValues,
	SerializedValues extends FieldValues = FieldValues,
	Errors extends Record<string, any> = Record<string, any>,
	Payload = any,
	TContext = any,
> = (
	fieldSchema: FieldSchema,
) => FieldType<
	FieldSchema,
	Values,
	RawValues,
	SerializedValues,
	Errors,
	Payload,
	TContext
>;

export type FormSchemaParams<
	FieldSchema,
	Values extends FieldValues = FieldValues,
	RawValues extends FieldValues = FieldValues,
	SerializedValues extends FieldValues = FieldValues,
	Errors extends Record<string, any> = Record<string, any>,
	Payload = any,
	TContext = any,
> = {
	names: string[];
	getFieldSchema?: GetFieldSchema<FieldSchema>;
	getFieldType: GetFieldType<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors,
		Payload,
		TContext
	>;
};

export type UseFormSchemaParams<
	FieldSchema,
	Values extends FieldValues = FieldValues,
	RawValues extends FieldValues = FieldValues,
	SerializedValues extends FieldValues = FieldValues,
	Errors extends Record<string, any> = Record<string, any>,
	Payload = any,
	TContext = any,
> = Readonly<
	Omit<UseFormProps<Values, TContext>, "defaultValues"> &
		FormSchemaParams<
			FieldSchema,
			Values,
			RawValues,
			SerializedValues,
			Errors,
			Payload,
			TContext
		> &
		Pick<UseFormProps<RawValues, TContext>, "defaultValues"> & {
			mapErrors?: MapErrors<Values, SerializedValues, Errors>;
		}
>;

export type OnSubmit<
	Values extends FieldValues = FieldValues,
	SerializedValues extends FieldValues = FieldValues,
	Errors extends Record<string, any> = Record<string, any>,
> = (
	serializedValues: SerializedValues,
	rawValues: Values,
	event?: BaseSyntheticEvent,
) => Errors | null | undefined | Promise<Errors | null | undefined>;

export type HandleSubmitBySchema<
	Values extends FieldValues = FieldValues,
	SerializedValues extends FieldValues = FieldValues,
	Errors extends Record<string, any> = Record<string, any>,
> = (
	onSubmit: OnSubmit<Values, SerializedValues, Errors>,
	onError?: SubmitErrorHandler<Values>,
) => (e?: BaseSyntheticEvent) => Promise<void>;

export type RenderField<
	Values extends FieldValues = FieldValues,
	Payload = any,
> = (
	name: string,
	payload?: Payload,
	parents?: readonly ParentType<Values>[],
) => ReactNode;

export type UseFormSchemaReturn<
	Values extends FieldValues = FieldValues,
	RawValues extends FieldValues = FieldValues,
	SerializedValues extends FieldValues = FieldValues,
	Errors extends Record<string, any> = Record<string, any>,
	Payload = any,
	TContext = any,
> = Readonly<
	Omit<UseFormReturn<Values, TContext, Values>, "handleSubmit"> & {
		handleSubmit: HandleSubmitBySchema<Values, SerializedValues, Errors>;
		parseValues: (values: RawValues) => Values | Promise<Values>;
		setValues: (rawValues: RawValues) => Promise<void>;
		renderField: RenderField<Values, Payload>;
	}
>;
