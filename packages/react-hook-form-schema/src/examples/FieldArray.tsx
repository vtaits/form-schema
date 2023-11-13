import { Fragment, useState, type ReactElement, type ReactNode } from "react";
import {
	type GetFieldSchema,
	serialize,
	parse,
	mapFieldErrors,
} from "@vtaits/form-schema";
import {
	type FieldType,
	type GetFieldType,
	renderBySchema,
	useFormSchema,
	type RenderParams,
} from "@vtaits/react-hook-form-schema";
import { useFieldArray, type FieldValues, type UseFormReturn, type ArrayPath, type FieldArray } from "react-hook-form";
import get from 'lodash/get';

const ARRAY_ERROR = 'ARRAY_ERROR';

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
	renderParams: {
		getFieldSchema,
		getFieldType,
		name,
		fieldSchema,
		parents,
	},
	formResult,
}: ArrayComponentProps<
FieldSchema,
Values,
RawValues,
SerializedValues,
Errors,
Payload,
TContext>): ReactElement {
	const { label, names, initialValues } = fieldSchema as FieldArraySchema;

	const errors = formResult.formState.errors[name]?.message as Record<string, unknown> | null;
	const arrayError = errors ? errors[ARRAY_ERROR] : null;

	const {
		append,
		fields,
		remove,
	} = useFieldArray({
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
					append((initialValues || {}) as FieldArray<Values, ArrayPath<Values>>[]);
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
					{arrayError.map((message, index) => (
						<li key={index}>{message}</li>
					))}
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

		createGetFieldSchema: (schema) => {
			const { fields } = schema as FieldArraySchema;
			const getChildFieldSchema: GetFieldSchema<FieldSchema> = (name: string) =>
				fields[name];

			return getChildFieldSchema;
		},

		serializer: (
			values,
			name,
			schema,
			getFieldSchema,
			getFieldType,
			parents,
		) => {
			const { names } = schema as FieldArraySchema;

			const arrayValues = values[name];

			if (!arrayValues) {
				return {
					[name]: [],
				};
			}

			return {
				[name]: (arrayValues as Values[]).map((arrayValue, index) =>
					serialize(arrayValue || {}, names, getFieldSchema, getFieldType, [
						...parents,
						{
							name: index,
							values: arrayValue || {},
						},
					]),
				),
			};
		},

		parser: (values, name, schema, getFieldSchema, getFieldType, parents) => {
			const { names } = schema as FieldArraySchema;

			const arrayValues = values[name];

			if (!arrayValues || arrayValues.length === 0) {
				return {
					[name]: [
						parse({}, names, getFieldSchema, getFieldType, [
							...parents,
							{
								name: 0,
								values: {},
							},
						]),
					],
				};
			}

			return {
				[name]: (arrayValues as Values[]).map((arrayValue, index) =>
					parse(arrayValue || {}, names, getFieldSchema, getFieldType, [
						...parents,
						{
							name: index,
							values: arrayValue || {},
						},
					]),
				),
			};
		},

		errorsMapper: (
			errors,
			name,
			schema,
			getFieldSchema,
			getFieldType,
			values,
			rawValues,
			parents,
		) => {
			const { names } = schema as FieldArraySchema;

			const arrayErrors = errors[name];

			if (!arrayErrors) {
				return {};
			}

			if (arrayErrors instanceof Array && typeof arrayErrors[0] === "string") {
				return {
					[name]: {
						[ARRAY_ERROR]: arrayErrors,
					},
				};
			}

			return {
				[name]: (arrayErrors as Errors[]).map((arrayError, index) =>
					mapFieldErrors(
						arrayError || {},
						names,
						getFieldSchema,
						getFieldType,
						values,
						rawValues,
						[
							...parents,
							{
								name: index,
								values: rawValues,
							},
						],
					),
				),
			};
		},
	},

	input: {
		render: (
			{ name: nameProp, fieldSchema, payload, parents },
			{ formState: { errors }, register },
		) => {
			const { label, placeholder } = fieldSchema as InputSchema;

			const name = payload ? `${payload}.${nameProp}` : nameProp;

			const fieldErrors = get(errors, name) as {
				message: string[];
			} | undefined;

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
							{fieldErrors.message.map((message, index) => (
								<li key={index}>{message}</li>
							))}
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

			values.users.forEach(({ firstName, lastName }, index) => {
				if (!firstName || !lastName) {
					hasError = true;
					const errorObj: Record<string, any> = {};

					if (!firstName) {
						setError(`root.users.${index}.firstName`, {
							type: 'custom',
							message: ["This field is required"],
						})
						// errorObj.firstName = ["This field is required"];
					}

					if (!lastName) {
						errorObj.lastName = ["This field is required"];
					}

					usersErrors[index] = errorObj;
				}
			});

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
		setError,
	} = useFormSchema({
		getFieldSchema,
		getFieldType,
		names,
	});

	console.log(errors);

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
