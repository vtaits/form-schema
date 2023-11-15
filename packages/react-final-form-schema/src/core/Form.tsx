import {
	type GetFieldSchema,
	parse,
	serialize,
	setFieldErrors,
	validateBeforeSubmit,
} from "@vtaits/form-schema";
import isPromise from "is-promise";
import { useCallback, useMemo } from "react";
import type { ReactElement } from "react";
import { useAsync } from "react-async-hook";
import { Form as FinalForm } from "react-final-form";
import type { FormProps as FinalFormProps } from "react-final-form";

import { FormSchemaContext } from "./FormSchemaContext";
import { IS_VALUES_READY_NAME } from "./constants";
import { makeSetError } from "./makeSetError";
import type { FormProps, FormSchemaContextType, MapErrors } from "./types";

export const defaultGetFieldSchema: GetFieldSchema<any> = (fieldSchema) =>
	fieldSchema;
export const defaultMapErrors: MapErrors = (errors) => errors;

export function Form<
	FieldSchema,
	Values extends Record<string, any>,
	RawValues extends Record<string, any>,
	SerializedValues extends Record<string, any>,
	Errors extends Record<string, any>,
	Payload,
>(
	props: FormProps<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors,
		Payload
	>,
): ReactElement {
	const {
		names,
		getFieldSchema = defaultGetFieldSchema as GetFieldSchema<FieldSchema>,
		getFieldType,
		initialValues: initialValuesProp = null,
		initialValuesPlaceholder = undefined,

		onSubmit: onSubmitProp,

		mapErrors = defaultMapErrors as MapErrors<Values, SerializedValues, Errors>,

		children,

		...rest
	} = props;

	const initialValuesResult = useMemo(() => {
		const rawInitialValues = initialValuesProp || {};

		return parse({
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
	}, [initialValuesProp, names, getFieldSchema, getFieldType]);

	const { result: initialValues } = useAsync(
		() => Promise.resolve(initialValuesResult),
		[initialValuesResult],
	);

	const onSubmit = useCallback<FinalFormProps<Values, Values>["onSubmit"]>(
		async (values) => {
			const validationErrors = {} as Errors;

			validateBeforeSubmit({
				setError: makeSetError(validationErrors),
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

			if (Object.keys(validationErrors).length > 0) {
				return validationErrors;
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

			const rawErrors = await onSubmitProp(valuesForSubmit, values);

			if (!rawErrors) {
				return null;
			}

			const preparedErrors = mapErrors(
				rawErrors as Errors,
				valuesForSubmit,
				values,
			);

			const mappedErrors = {} as Errors;

			setFieldErrors({
				setError: makeSetError(mappedErrors),
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

			return mappedErrors;
		},
		[onSubmitProp, names, getFieldSchema, getFieldType, mapErrors],
	);

	const providedInitialValues = useMemo(() => {
		const initialValuesClean = isPromise(initialValuesResult)
			? initialValues
			: initialValuesResult;

		if (initialValuesClean) {
			return {
				...initialValuesClean,
				[IS_VALUES_READY_NAME]: true,
			};
		}

		return {
			...initialValuesPlaceholder,
			[IS_VALUES_READY_NAME]: false,
		};
	}, [initialValuesResult, initialValues, initialValuesPlaceholder]);

	const providerValue = useMemo(
		() =>
			({
				getFieldSchema,
				getFieldType,
			}) as FormSchemaContextType<unknown>,
		[getFieldSchema, getFieldType],
	);

	return (
		<FormSchemaContext.Provider value={providerValue}>
			<FinalForm
				{...rest}
				onSubmit={onSubmit}
				initialValues={providedInitialValues as unknown as Values}
			>
				{children}
			</FinalForm>
		</FormSchemaContext.Provider>
	);
}
