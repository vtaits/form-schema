import {
	type GetFieldSchema,
	type ParentType,
	parse,
	serialize,
	setFieldErrors,
	validateBeforeSubmit,
} from "@vtaits/form-schema";
import isPromise from "is-promise";
import { type BaseSyntheticEvent, useCallback, useMemo } from "react";
import {
	type DefaultValues,
	type FieldValues,
	type SubmitErrorHandler,
	type SubmitHandler,
	useForm,
} from "react-hook-form";

import { CLIENT_ERROR, SERVER_ERROR } from "./constants";
import { makeSetError } from "./makeSetError";
import { renderBySchema } from "./renderBySchema";
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
			const asyncDefaultValues = defaultValues;

			return () =>
				asyncDefaultValues().then(
					(rawInitialValues) =>
						(parse({
							values: rawInitialValues,
							names,
							getFieldSchema,
							getFieldType,
							parents: [
								{
									values: rawInitialValues,
								},
							],
						}) || {}) as Values,
				);
		}

		const rawInitialValues = defaultValues || {};

		const parseResult = parse({
			values: rawInitialValues as RawValues,
			names,
			getFieldSchema,
			getFieldType,
			parents: [
				{
					values: rawInitialValues as RawValues,
				},
			],
		});

		if (isPromise(parseResult)) {
			return () => parseResult;
		}

		return (parseResult as DefaultValues<Values>) || undefined;
	}, [defaultValues, names, getFieldSchema, getFieldType]);

	const formResult = useForm<Values, TContext, Values>({
		...rest,
		defaultValues: parsedDefaultValues,
	});

	const { handleSubmit, ...restResult } = formResult;

	const { getValues, setError } = restResult;

	const onSubmitBySchema = useCallback(
		async (
			onSubmit: OnSubmit<Values, SerializedValues, Errors>,
			values: Values,
			event?: BaseSyntheticEvent,
		) => {
			let hasCleintError = false;

			validateBeforeSubmit({
				setError: makeSetError(setError, CLIENT_ERROR, () => {
					hasCleintError = true;
				}),
				values,
				names,
				getFieldSchema,
				getFieldType,
				parents: [
					{
						values,
					},
				],
			});

			if (hasCleintError) {
				return;
			}

			const valuesForSubmit = serialize({
				values,
				names,
				getFieldSchema,
				getFieldType,
				parents: [
					{
						values,
					},
				],
			});

			const rawErrors = await onSubmit(valuesForSubmit, values, event);

			if (!rawErrors) {
				return;
			}

			const preparedErrors = mapErrors(
				rawErrors as Errors,
				valuesForSubmit,
				values,
			);

			setFieldErrors({
				setError: makeSetError(setError, SERVER_ERROR, () => {}),
				errors: preparedErrors,
				names,
				getFieldSchema,
				getFieldType,
				values: valuesForSubmit,
				rawValues: values,
				parents: [
					{
						values,
					},
				],
			});
		},
		[names, getFieldSchema, getFieldType, mapErrors, setError],
	);

	const handleSubmitBySchema = useCallback(
		(
			onSubmit: OnSubmit<Values, SerializedValues, Errors>,
			onError?: SubmitErrorHandler<Values>,
		) => {
			const submitHandler: SubmitHandler<Values> = (values, event) =>
				onSubmitBySchema(onSubmit, values, event);

			return handleSubmit(
				submitHandler as Values extends undefined
					? SubmitHandler<Values>
					: Values extends FieldValues
					  ? SubmitHandler<Values>
					  : never,
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
		) =>
			renderBySchema(
				formResult,
				getFieldSchema,
				getFieldType,
				getValues,
				name,
				payload,
				parents,
			),
		[formResult, getFieldSchema, getFieldType, getValues],
	);

	return {
		...restResult,
		handleSubmit: handleSubmitBySchema,
		renderField,
	};
}
