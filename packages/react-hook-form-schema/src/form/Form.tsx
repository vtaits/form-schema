import type { GetFieldSchema, NameType } from "@vtaits/form-schema";
import { useUI } from "@vtaits/react-form-schema-base-ui";
import {
	type BaseSyntheticEvent,
	Fragment,
	type ReactElement,
	type ReactNode,
	useCallback,
	useMemo,
} from "react";
import type { DefaultValues, FieldValues } from "react-hook-form";
import {
	type FieldSchemaWithRenderBase,
	type FieldType,
	type GetFieldType,
	type OnSubmit,
	type RenderField,
	type UseFormSchemaReturn,
	useFormSchema,
} from "../core";
import { renderError } from "../fields/base/renderError";
import { defaultFieldTypes } from "./defaultFieldTypes";
import type { DefaultFieldSchema } from "./schema";

type AsyncDefaultValues<TFieldValues> = (
	payload?: unknown,
) => Promise<TFieldValues>;

export type RenderProps<
	FieldSchema,
	Values extends FieldValues = FieldValues,
	RawValues extends FieldValues = FieldValues,
	SerializedValues extends FieldValues = FieldValues,
	Errors extends Record<string, any> = Record<string, any>,
	Payload = any,
	TContext = any,
> = Readonly<{
	formApi: UseFormSchemaReturn<
		Values,
		RawValues,
		SerializedValues,
		Errors,
		Payload,
		TContext
	>;
	getFieldSchema: GetFieldSchema<FieldSchema>;
	getFieldType: GetFieldType<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors,
		Payload,
		TContext
	>;
	names: readonly string[];
	isSubmitting: boolean;
	renderField: RenderField<Values, Payload>;
	onSubmit: (event?: BaseSyntheticEvent) => void;
}>;

export function defaultRenderFields<
	FieldSchema,
	Values extends FieldValues = FieldValues,
	RawValues extends FieldValues = FieldValues,
	SerializedValues extends FieldValues = FieldValues,
	Errors extends Record<string, any> = Record<string, any>,
	Payload = any,
	TContext = any,
>({
	names,
	renderField,
}: RenderProps<
	FieldSchema,
	Values,
	RawValues,
	SerializedValues,
	Errors,
	Payload,
	TContext
>) {
	return (
		<>
			{names.map((name) => (
				<Fragment key={name}>{renderField(name)}</Fragment>
			))}
		</>
	);
}

export type FormProps<
	FieldSchema,
	Values extends FieldValues = FieldValues,
	RawValues extends FieldValues = FieldValues,
	SerializedValues extends FieldValues = FieldValues,
	Errors extends Record<string, any> = Record<string, any>,
	Payload = any,
	TContext = any,
> = Readonly<{
	/**
	 *
	 */
	defaultValues?: AsyncDefaultValues<RawValues> | DefaultValues<RawValues>;
	/**
	 *
	 */
	fieldTypes?: Record<
		string,
		FieldType<
			DefaultFieldSchema<
				FieldSchema,
				Values,
				RawValues,
				SerializedValues,
				Errors,
				Payload
			>,
			Values,
			RawValues,
			SerializedValues,
			Errors,
			Payload,
			TContext
		>
	>;
	/**
	 *
	 */
	getFormError?: (errors: Errors) => string | null | undefined;
	/**
	 *
	 */
	onSubmit?: OnSubmit<Values, SerializedValues, Errors>;
	/**
	 *
	 */
	renderActions?: (
		renderProps: RenderProps<
			FieldSchema,
			Values,
			RawValues,
			SerializedValues,
			Errors,
			Payload,
			TContext
		>,
	) => ReactNode;
	/**
	 *
	 */
	renderFields?: (
		renderProps: RenderProps<
			FieldSchema,
			Values,
			RawValues,
			SerializedValues,
			Errors,
			Payload,
			TContext
		>,
	) => ReactNode;
	/**
	 *
	 */
	schemas: Record<
		string,
		DefaultFieldSchema<
			FieldSchema,
			Values,
			RawValues,
			SerializedValues,
			Errors,
			Payload
		>
	>;
	/**
	 *
	 */
	title?: ReactNode;
}>;

export const defaultGetFormError = <Errors extends Record<string, any>>(
	errors: Errors,
) => {
	if (typeof errors.error === "string") {
		return errors.error;
	}

	return null;
};

export function Form<
	FieldSchema extends FieldSchemaWithRenderBase,
	Values extends FieldValues = FieldValues,
	RawValues extends FieldValues = FieldValues,
	SerializedValues extends FieldValues = FieldValues,
	Errors extends Record<string, any> = Record<string, any>,
	Payload = any,
	TContext = any,
>({
	defaultValues = undefined,
	fieldTypes = undefined,
	getFormError = defaultGetFormError,
	onSubmit: onSubmitProp = undefined,
	renderActions,
	renderFields = defaultRenderFields,
	schemas,
	title,
}: FormProps<
	FieldSchema,
	Values,
	RawValues,
	SerializedValues,
	Errors,
	Payload,
	TContext
>): ReactElement {
	const { renderForm } = useUI();

	const getFieldSchema = useCallback(
		(name: NameType) => schemas[name] as FieldSchema,
		[schemas],
	);

	const names = useMemo(() => Object.keys(schemas), [schemas]);

	const getFieldType = useCallback(
		(
			schema: DefaultFieldSchema<
				FieldSchema,
				Values,
				RawValues,
				SerializedValues,
				Errors,
				Payload
			>,
		) => {
			const { type } = schema as {
				type: string;
			};

			const defaultType =
				defaultFieldTypes[type as keyof typeof defaultFieldTypes];

			if (defaultType) {
				return defaultType as unknown as FieldType<
					DefaultFieldSchema<
						FieldSchema,
						Values,
						RawValues,
						SerializedValues,
						Errors,
						Payload
					>,
					Values,
					RawValues,
					SerializedValues,
					Errors,
					Payload,
					TContext
				>;
			}

			if (!fieldTypes) {
				throw new Error(
					"[react-hook-form-schema] `fieldTypes` should be provided for custom field types",
				);
			}

			return fieldTypes[type];
		},
		[fieldTypes],
	);

	const formApi = useFormSchema({
		defaultValues,
		getFieldSchema,
		getFieldType,
		names,
	});

	const {
		formState: { errors, isSubmitting },
		handleSubmit,
		renderField,
		setError,
	} = formApi;

	const onSubmit = useCallback<OnSubmit<Values, SerializedValues, Errors>>(
		async (
			serializedValues: SerializedValues,
			rawValues: Values,
			event?: BaseSyntheticEvent,
		) => {
			if (!onSubmitProp) {
				return null;
			}

			const result = await onSubmitProp(serializedValues, rawValues, event);

			if (!result) {
				return null;
			}

			const formError = getFormError(result);

			if (formError) {
				setError("root", {
					type: "serverError",
					message: formError,
				});
			}

			return result;
		},
		[getFormError, onSubmitProp, setError],
	);

	const submitHandler = handleSubmit(onSubmit);

	const renderProps: RenderProps<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors,
		Payload,
		TContext
	> = {
		formApi,
		getFieldSchema,
		getFieldType: getFieldType as GetFieldType<
			FieldSchema,
			Values,
			RawValues,
			SerializedValues,
			Errors,
			Payload,
			TContext
		>,
		names,
		onSubmit: submitHandler,
		renderField,
		isSubmitting,
	};

	return renderForm({
		actions: renderActions ? renderActions(renderProps) : undefined,
		error: errors.root ? renderError(errors.root) : undefined,
		fields: renderFields(renderProps),
		formProps: {
			onSubmit: submitHandler,
		},
		title,
	}) as ReactElement;
}
