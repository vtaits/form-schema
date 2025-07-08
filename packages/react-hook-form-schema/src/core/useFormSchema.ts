import {
	type GetFieldSchema,
	type ParentType,
	parse,
	serialize,
	setFieldErrors,
	validateBeforeSubmit,
} from "@vtaits/form-schema";
import { type BaseSyntheticEvent, useCallback, useMemo } from "react";
import {
	type FieldValues,
	type SubmitErrorHandler,
	type SubmitHandler,
	useForm,
} from "react-hook-form";
import { CLIENT_ERROR, SERVER_ERROR } from "./constants";
import { makeSetError } from "./makeSetError";
import { renderBySchema } from "./renderBySchema";
import type {
	FieldSchemaWithRenderBase,
	MapErrors,
	OnSubmit,
	UseFormSchemaParams,
	UseFormSchemaReturn,
} from "./types";

export const defaultGetFieldSchema: GetFieldSchema<any> = (fieldSchema) =>
	fieldSchema;
export const defaultMapErrors: MapErrors = (errors) => errors;

function setFormValues(
	parent: string | null,
	values: readonly unknown[] | Record<string, unknown>,
	setValue: (name: string, value: unknown) => void,
) {
	if (Array.isArray(values)) {
		for (let index = 0; index < values.length; ++index) {
			const accName = parent ? `${parent}[${index}]` : `${index}`;

			const value = values[index];

			if (typeof value === "object") {
				if (!value) {
					setValue(accName, value);
					continue;
				}

				setFormValues(
					accName,
					value as readonly unknown[] | Record<string, unknown>,
					setValue,
				);
				continue;
			}

			setValue(accName, value);
		}

		return;
	}

	for (const [name, value] of Object.entries(values)) {
		const accName = parent ? `${parent}.${name}` : name;

		if (typeof value === "object") {
			if (!value) {
				setValue(accName, value);
				continue;
			}

			setFormValues(
				accName,
				value as readonly unknown[] | Record<string, unknown>,
				setValue,
			);
			continue;
		}

		setValue(accName, value);
	}
}

export function useFormSchema<
	FieldSchema extends FieldSchemaWithRenderBase,
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
): UseFormSchemaReturn<
	Values,
	RawValues,
	SerializedValues,
	Errors,
	Payload,
	TContext
> {
	const {
		defaultValues,
		getFieldSchema = defaultGetFieldSchema as GetFieldSchema<FieldSchema>,
		getFieldType,
		mapErrors = defaultMapErrors as MapErrors<Values, SerializedValues, Errors>,
		names,
		...rest
	} = props;

	const parseValues = useCallback(
		(values: RawValues) =>
			parse({
				values,
				names,
				getFieldSchema,
				getFieldType,
				parents: [
					{
						values,
					},
				],
			}),
		[getFieldSchema, getFieldType, names],
	);

	const parsedDefaultValues = useMemo(() => {
		if (typeof defaultValues === "function") {
			const asyncDefaultValues = defaultValues as () => Promise<RawValues>;

			return () =>
				asyncDefaultValues()
					.then((rawInitialValues) => parseValues(rawInitialValues))
					.then((result) => result || ({} as Values));
		}

		const rawInitialValues = defaultValues || {};

		const parseResult = parseValues(rawInitialValues as RawValues);

		return () => parseResult;
	}, [defaultValues, parseValues]);

	const formResult = useForm<Values, TContext, Values>({
		...rest,
		defaultValues: parsedDefaultValues,
	});

	const { handleSubmit, ...restResult } = formResult;

	const { getValues, setValue, setError } = restResult;

	const setValues = useCallback(
		async (rawValues: RawValues) => {
			const values = await parseValues(rawValues);

			setFormValues(
				null,
				values,
				setValue as (name: string, value: unknown) => void,
			);
		},
		[parseValues, setValue],
	);

	const onSubmitBySchema = useCallback(
		async (
			onSubmit: OnSubmit<Values, SerializedValues, Errors>,
			values: Values,
			event?: BaseSyntheticEvent,
		) => {
			let hasCleintError = false;

			await validateBeforeSubmit({
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

			const valuesForSubmit = await serialize({
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

			await setFieldErrors({
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
		parseValues,
		setValues,
		renderField,
	};
}
