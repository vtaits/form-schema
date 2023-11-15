import {
	type GetFieldSchema,
	parse,
	serialize,
	setFieldErrors,
} from "@vtaits/form-schema";
import {
	type FieldType,
	type GetFieldType,
	type RenderParams,
	renderBySchema,
	useFormSchema,
} from "@vtaits/react-hook-form-schema";
import get from "lodash/get";
import { Fragment, type ReactElement, type ReactNode, useState } from "react";
import {
	type ArrayPath,
	type FieldArray as FieldArrayType,
	type FieldValues,
	type UseFormReturn,
	useFieldArray,
} from "react-hook-form";

const ARRAY_ERROR = "ARRAY_ERROR";

type FieldArraySchema = {
	type: "array";
	label: string;
	fields: Record<string, FieldSchema>;
	initialValues?: FieldValues;
	names: readonly string[];
};

export type ArrayComponentProps<
	FieldSchema,
	Values extends FieldValues,
	RawValues extends FieldValues,
	SerializedValues extends FieldValues,
	Errors extends Record<string, any>,
	Payload,
	TContext,
> = {
	renderParams: RenderParams<
		FieldSchema,
		Values,
		RawValues,
		SerializedValues,
		Errors,
		Payload
	>;
	formResult: UseFormReturn<Values, TContext, Values>;
};

function ArrayComponent<
	FieldSchema,
	Values extends FieldValues,
	RawValues extends FieldValues,
	SerializedValues extends FieldValues,
	Errors extends Record<string, any>,
	Payload,
	TContext,
>({
	renderParams: { getFieldSchema, getFieldType, name, fieldSchema, parents },
	formResult,
}: ArrayComponentProps<
	FieldSchema,
	Values,
	RawValues,
	SerializedValues,
	Errors,
	Payload,
	TContext
>): ReactElement {
	const { label, names, initialValues } = fieldSchema as FieldArraySchema;

	const errors = formResult.formState.errors[name]?.message as Record<
		string,
		unknown
	> | null;
	const arrayError = errors ? errors[ARRAY_ERROR] : null;

	const { append, fields, remove } = useFieldArray({
		control: formResult.control,
		name: name as ArrayPath<Values>,
	});

	return (
		<>
			{label && <h3>{label}</h3>}

			{fields.map((field, index) => {
				const providedParents = [
					...parents,
					{
						name,
						values: fields,
					},
					{
						name: index,
						values: field,
					},
				];

				return (
					<div key={field.id}>
						{names.map((fieldName) => (
							<Fragment key={fieldName}>
								{renderBySchema(
									formResult,
									getFieldSchema,
									getFieldType,
									() => field,
									fieldName,
									`${name}.${index}`,
									providedParents,
								)}
							</Fragment>
						))}

						<button
							type="button"
							onClick={() => {
								remove(index);
							}}
						>
							Remove
						</button>

						<hr />
					</div>
				);
			})}

			<button
				type="button"
				onClick={(): void => {
					append(
						(initialValues || {}) as FieldArrayType<
							Values,
							ArrayPath<Values>
						>[],
					);
				}}
			>
				Add
			</button>

			{arrayError && (
				<ul
					style={{
						color: "red",
					}}
				>
					<li>{arrayError}</li>
				</ul>
			)}
		</>
	);
}

type InputSchema = {
	type: "input";
	label?: string;
	placeholder?: string;
};

type FieldSchema = FieldArraySchema | InputSchema;
type Values = Record<string, any>;
type Errors = Record<string, any>;

const fieldTypes: Record<
	string,
	FieldType<FieldSchema, Values, Values, Values, Errors, string>
> = {
	array: {
		render: (renderParams, formResult) => (
			<ArrayComponent renderParams={renderParams} formResult={formResult} />
		),

		createGetFieldSchema: ({ fieldSchema }) => {
			const { fields } = fieldSchema as FieldArraySchema;
			const getChildFieldSchema: GetFieldSchema<FieldSchema> = (name: string) =>
				fields[name];

			return getChildFieldSchema;
		},

		serializer: ({
			values,
			name,
			fieldSchema,
			getFieldSchema,
			getFieldType,
			parents,
		}) => {
			const { names } = fieldSchema as FieldArraySchema;

			const arrayValues = values[name];

			if (!arrayValues) {
				return {
					[name]: [],
				};
			}

			return {
				[name]: (arrayValues as Values[]).map((arrayValue, index) =>
					serialize({
						values: arrayValue || {},
						names,
						getFieldSchema,
						getFieldType,
						parents: [
							...parents,
							{
								name: index,
								values: arrayValue || {},
							},
						],
					}),
				),
			};
		},

		parser: ({
			values,
			name,
			fieldSchema,
			getFieldSchema,
			getFieldType,
			parents,
		}) => {
			const { names } = fieldSchema as FieldArraySchema;

			const arrayValues = values[name];

			if (!arrayValues || arrayValues.length === 0) {
				return {
					[name]: [
						parse({
							values: {},
							names,
							getFieldSchema,
							getFieldType,
							parents: [
								...parents,
								{
									name: 0,
									values: {},
								},
							],
						}),
					],
				};
			}

			return {
				[name]: (arrayValues as Values[]).map((arrayValue, index) =>
					parse({
						values: arrayValue || {},
						names,
						getFieldSchema,
						getFieldType,
						parents: [
							...parents,
							{
								name: index,
								values: arrayValue || {},
							},
						],
					}),
				),
			};
		},

		errorsSetter: ({
			setError,
			errors,
			name,
			fieldSchema,
			getFieldSchema,
			getFieldType,
			values,
			rawValues,
			parents,
		}) => {
			const { names } = fieldSchema as FieldArraySchema;

			const arrayErrors = errors[name];

			if (!arrayErrors) {
				return {};
			}

			if (Array.isArray(arrayErrors) && typeof arrayErrors[0] === "string") {
				setError(name, parents, arrayErrors);
				return;
			}

			if (Array.isArray(arrayErrors)) {
				for (let index = 0; index < arrayErrors.length; ++index) {
					const arrayError = arrayErrors[index];

					setFieldErrors({
						setError,
						errors: arrayError || {},
						names,
						getFieldSchema,
						getFieldType,
						values,
						rawValues,
						parents: [
							...parents,
							{
								name,
								values: rawValues[name],
							},
							{
								name: index,
								values: rawValues[name][index],
							},
						],
					});
				}
			}
		},
	},

	input: {
		render: (
			{ name: nameProp, fieldSchema, payload, parents },
			{ formState: { errors }, register },
		) => {
			const { label, placeholder } = fieldSchema as InputSchema;

			const name = payload ? `${payload}.${nameProp}` : nameProp;

			const fieldErrors = get(errors, name) as
				| {
						message: string[];
				  }
				| undefined;

			return (
				<div>
					{label && <p>{label}</p>}

					<p>
						<input placeholder={placeholder || ""} {...register(name)} />
					</p>

					{fieldErrors && (
						<ul
							style={{
								color: "red",
							}}
						>
							<li>{fieldErrors.message}</li>
						</ul>
					)}
				</div>
			);
		},
	},
};

const getFieldType: GetFieldType<
	FieldSchema,
	Values,
	Values,
	Values,
	Errors,
	string
> = ({ type }) => fieldTypes[type];

const fullSchema: Record<string, FieldSchema> = {
	users: {
		type: "array",

		label: "Users",

		initialValues: {
			firstName: "",
			lastName: "",
		},

		fields: {
			firstName: {
				type: "input",
				label: "First name",
				placeholder: "Input first name",
			},

			lastName: {
				type: "input",
				label: "Last name",
				placeholder: "Input last name",
			},
		},

		names: ["firstName", "lastName"],
	},
};

const getFieldSchema: GetFieldSchema<FieldSchema> = (fieldName: string) =>
	fullSchema[fieldName];

const names: string[] = ["users"];

const delay = (ms: number): Promise<void> =>
	new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, ms);
	});

export function FieldArray(): ReactElement {
	const [submittedValues, setSubmittedValues] = useState<Record<
		string,
		any
	> | null>(null);

	const onSubmit = async (
		values: Record<string, any>,
	): Promise<Errors | null> => {
		setSubmittedValues(null);

		await delay(1000);

		const errors: Errors = {};

		if (values.users.length === 0) {
			errors.users = ["This field is required"];
		} else {
			let hasError = false;
			const usersErrors: Array<Record<string, any>> = [];

			const users = values.users as {
				firstName?: string;
				lastName?: string;
			}[];

			for (let index = 0; index < users.length; ++index) {
				const { firstName, lastName } = users[index];

				if (!firstName || !lastName) {
					hasError = true;
					const errorObj: Record<string, any> = {};

					if (!firstName) {
						errorObj.firstName = "This field is required";
					}

					if (!lastName) {
						errorObj.lastName = "This field is required";
					}

					usersErrors[index] = errorObj;
				}
			}

			if (hasError) {
				errors.users = usersErrors;
			}
		}

		if (Object.keys(errors).length === 0) {
			setSubmittedValues(values);
			return null;
		}

		return errors;
	};

	const {
		formState: { isSubmitting, errors },
		handleSubmit,
		renderField,
	} = useFormSchema({
		getFieldSchema,
		getFieldType,
		names,
	});

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				{renderField("users")}

				<hr />

				<button type="submit" disabled={isSubmitting}>
					Submit
				</button>
			</form>

			{submittedValues && (
				<>
					<hr />

					<h3>Submitted values:</h3>

					<pre>{JSON.stringify(submittedValues, null, 2)}</pre>
				</>
			)}
		</>
	);
}
