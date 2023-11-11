import {
	type GetFieldSchema,
	type ParentType,
	mapFieldErrors,
	parse,
	serialize,
	validateBeforeSubmit,
} from "@vtaits/form-schema";
import isPromise from "is-promise";
import { type BaseSyntheticEvent, useCallback, useMemo } from "react";
import {
	type DefaultValues,
	type FieldValues,
	type Path,
	type SubmitErrorHandler,
	type SubmitHandler,
	useForm,
} from "react-hook-form";

import type {
	MapErrors,
	OnSubmit,
	UseFormSchemaParams,
	UseFormSchemaReturn,
} from "./types";

export const defaultGetFieldSchema: GetFieldSchema<any> = (fieldSchema) =>
	fieldSchema;
export const defaultMapErrors: MapErrors = (errors) => errors;

export function useFormSchema<
	FieldSchema,
	Values extends FieldValues = FieldValues,
	RawValues extends FieldValues = FieldValues,
	SerializedValues extends FieldValues = FieldValues,
	Errors extends Record<string, any> = Record<string, any>,
	Payload = any,
	TContext = any,
>(
	props: UseFormSchemaParams<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors,
		Payload,
		TContext
	>,
): UseFormSchemaReturn<Values, SerializedValues, Errors, Payload, TContext> {
	const {
		defaultValues,
		getFieldSchema = defaultGetFieldSchema as GetFieldSchema<FieldSchema>,
		getFieldType,
		mapErrors = defaultMapErrors as MapErrors<Values, SerializedValues, Errors>,
		names,
		...rest
	} = props;

	const parsedDefaultValues = useMemo(() => {
		if (typeof defaultValues === "function") {
			return () =>
				defaultValues().then(
					(rawInitialValues) =>
						(parse(rawInitialValues, names, getFieldSchema, getFieldType, [
							{
								values: rawInitialValues,
							},
						]) || {}) as Values,
				);
		}

		const rawInitialValues = defaultValues || {};

		const parseResult = parse(
			rawInitialValues as RawValues,
			names,
			getFieldSchema,
			getFieldType,
			[
				{
					values: rawInitialValues as RawValues,
				},
			],
		);

		if (isPromise(parseResult)) {
			return () => parseResult;
		}

		return (
			(parse(
				rawInitialValues as RawValues,
				names,
				getFieldSchema,
				getFieldType,
				[
					{
						values: rawInitialValues as RawValues,
					},
				],
			) as DefaultValues<Values>) || undefined
		);
	}, [defaultValues, names, getFieldSchema, getFieldType]);

	const formResult = useForm<Values, TContext, Values>({
		...rest,
		defaultValues: parsedDefaultValues,
	});

	const { handleSubmit, ...restResult } = formResult;

	const { getValues, setError } = restResult;

	const setErrors = useCallback(
		(errors: Errors) => {
			for (const [name, error] of Object.entries(errors)) {
				setError(name as Path<Values>, {
					type: "serverError",
					message: error,
				});
			}
		},
		[setError],
	);

	const onSubmitBySchema = useCallback(
		async (
			onSubmit: OnSubmit<Values, SerializedValues, Errors>,
			values: Values,
			event?: BaseSyntheticEvent,
		) => {
			const validationErrors = validateBeforeSubmit(
				values,
				names,
				getFieldSchema,
				getFieldType,
				[
					{
						values,
					},
				],
			);

			if (Object.keys(validationErrors).length > 0) {
				setErrors(validationErrors);
				return;
			}

			const valuesForSubmit = serialize(
				values,
				names,
				getFieldSchema,
				getFieldType,
				[
					{
						values,
					},
				],
			);

			const rawErrors = await onSubmit(valuesForSubmit, values, event);

			if (!rawErrors) {
				return;
			}

			const preparedErrors = mapErrors(
				rawErrors as Errors,
				valuesForSubmit,
				values,
			);

			const mappedErrors = mapFieldErrors(
				preparedErrors,
				names,
				getFieldSchema,
				getFieldType,
				valuesForSubmit,
				values,
				[
					{
						values,
					},
				],
			);

			setErrors(mappedErrors);
		},
		[names, getFieldSchema, getFieldType, mapErrors, setErrors],
	);

	const handleSubmitBySchema = useCallback(
		(
			onSubmit: OnSubmit<Values, SerializedValues, Errors>,
			onError?: SubmitErrorHandler<Values>,
		) => {
			const submitHandler: SubmitHandler<Values> = (values, event) =>
				onSubmitBySchema(onSubmit, values, event);

			return handleSubmit(
				submitHandler as Values extends FieldValues
					? SubmitHandler<Values>
					: SubmitHandler<Values>,
				onError,
			);
		},
		[handleSubmit, onSubmitBySchema],
	);

	const renderField = useCallback(
		(
			name: string,
			payload?: Payload,
			parents?: readonly ParentType<Values>[],
		) => {
			const fieldSchema = getFieldSchema(name);
			const fieldType = getFieldType(fieldSchema);

			const { render, createGetFieldSchema } = fieldType;

			const values = getValues();

			const providedParents = parents || [
				{
					values,
				},
			];

			const childGetFieldSchema: GetFieldSchema<FieldSchema> =
				createGetFieldSchema
					? createGetFieldSchema(
							fieldSchema,
							getFieldSchema,
							getFieldType,
							values,
							"render",
							providedParents,
					  )
					: getFieldSchema;

			return render(
				{
					name,
					payload,
					parents: providedParents,
					getFieldSchema: childGetFieldSchema,
					getFieldType,
					fieldSchema,
				},
				formResult,
			);
		},
		[getFieldSchema, getFieldType, getValues],
	);

	return {
		...restResult,
		handleSubmit: handleSubmitBySchema,
		renderField,
	};
}
