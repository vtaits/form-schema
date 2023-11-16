import {
	type GetFieldSchema,
	parse,
	serialize,
	setFieldErrors,
} from "@vtaits/form-schema";
import { ARRAY_ERROR } from "final-form";
import arrayMutators from "final-form-arrays";
import { Fragment, type ReactElement, type ReactNode, useState } from "react";
import { useField } from "react-final-form";
import { useFieldArray } from "react-final-form-arrays";
import {
	type FieldComponentProps,
	type FieldType,
	Form,
	FormField,
	type GetFieldType,
} from "../core";

type FieldArraySchema = {
	type: "array";
	label: string;
	fields: Record<string, FieldSchema>;
	initialValues?: Record<string, any>;
	names: readonly string[];
};

type ArrayProps = FieldComponentProps<FieldSchema>;

function ArrayComponent({
	name,

	fieldSchema,

	parents,
}: ArrayProps): ReactElement {
	const { label, names, initialValues } = fieldSchema as FieldArraySchema;

	const {
		fields,

		meta: { dirtySinceLastSubmit, submitError },
	} = useFieldArray(name);

	return (
		<>
			{label && <h3>{label}</h3>}

			{fields.map((namePrefix, index) => {
				const currrentValues = (fields.value || [])[index] || {};
				return (
					<div data-testid={`${name}/${index}`} key={namePrefix}>
						{names.map((fieldName) => (
							<Fragment key={fieldName}>
								<FormField
									name={fieldName}
									payload={namePrefix}
									parents={[
										...parents,
										{
											name: index,
											values: currrentValues,
										},
									]}
								/>
							</Fragment>
						))}

						<button
							type="button"
							onClick={(): void => {
								fields.remove(index);
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
					fields.push(initialValues || {});
				}}
			>
				Add
			</button>

			{!dirtySinceLastSubmit &&
				submitError &&
				typeof submitError === "string" && (
					<ul
						style={{
							color: "red",
						}}
					>
						<li data-testid={`${name}/error`}>{submitError}</li>
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

type InputProps = {
	name: string;
	fieldSchema: FieldSchema;
	payload?: string;
};

function InputComponent({
	name: nameProp,

	fieldSchema,

	payload = undefined,
}: InputProps): ReactElement {
	const { label, placeholder } = fieldSchema as InputSchema;

	const name = payload ? `${payload}.${nameProp}` : nameProp;

	const {
		input: { value, onChange },

		meta: { dirtySinceLastSubmit, submitError },
	} = useField(name);

	return (
		<div>
			{label && <p>{label}</p>}

			<p>
				<input
					name={name}
					value={value || ""}
					placeholder={placeholder || ""}
					onChange={onChange}
				/>
			</p>

			{!dirtySinceLastSubmit && submitError && (
				<ul
					style={{
						color: "red",
					}}
				>
					<li>{submitError}</li>
				</ul>
			)}
		</div>
	);
}

type FieldSchema = FieldArraySchema | InputSchema;
type Values = Record<string, any>;
type Errors = Record<string, any>;

const fieldTypes: Record<
	string,
	FieldType<FieldSchema, Values, Values, Values, Errors, string>
> = {
	array: {
		component: ArrayComponent,

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

			if (typeof arrayErrors === "string") {
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
		component: InputComponent,
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

		await delay(800);

		const errors: Errors = {};

		if (values.users.length === 0) {
			errors.users = "This field is required";
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

	return (
		<>
			<Form
				mutators={{
					...arrayMutators,
				}}
				getFieldSchema={getFieldSchema}
				getFieldType={getFieldType}
				names={names}
				onSubmit={onSubmit}
			>
				{({ handleSubmit, submitting }): ReactNode => (
					<form onSubmit={handleSubmit}>
						<FormField name="users" />

						<hr />

						<button type="submit" disabled={submitting}>
							Submit
						</button>
					</form>
				)}
			</Form>

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
