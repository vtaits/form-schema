import type { GetFieldSchema } from "@vtaits/form-schema";
import { type ReactElement, type ReactNode, useState } from "react";
import { useField } from "react-final-form";
import { type FieldType, Form, FormField, type GetFieldType } from "../core";
import { type DynamicSchema, dynamic } from "../fields/dynamic";

type InputSchema = {
	type: "input";
	label?: string;
	placeholder?: string;
	disabled?: boolean;
};

type InputProps = {
	name: string;

	fieldSchema: InputSchema;
};

function InputComponent({
	name,

	fieldSchema: { label, placeholder, disabled },
}: InputProps): ReactElement {
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
					disabled={disabled}
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

const fieldTypes: Record<string, FieldType<any>> = {
	input: {
		component: InputComponent,

		serializer: ({ name, values }) => ({
			[name]: values[name] || "",
		}),
	},

	dynamic,
};

type FieldSchema =
	| InputSchema
	| (DynamicSchema<InputSchema> & {
			type: "dynamic";
	  });

const getFieldType: GetFieldType<FieldSchema> = ({ type }) => fieldTypes[type];

const fullSchema: Record<string, FieldSchema> = {
	firstName: {
		type: "input",
		label: "First name",
		placeholder: "Input your first name",
	},

	lastName: {
		type: "dynamic",

		getSchema: ({
			firstName,
		}: {
			firstName?: string;
		}) => ({
			type: "input",
			label: firstName
				? `Last name of ${firstName}`
				: "INPUT YOUR FIRST NAME FIRST!!!",
			placeholder: "Input your last name",
			disabled: !firstName,
		}),
	},

	wow: {
		type: "dynamic",

		getSchema: ({
			lastName,
		}: {
			lastName?: string;
		}) => {
			if (!lastName) {
				return null;
			}

			return {
				type: "input",
				label: "WOW",
				placeholder: "WOW",
			};
		},
	},
};

const getFieldSchema: GetFieldSchema<FieldSchema> = (fieldName: string) =>
	fullSchema[fieldName];

const names = ["firstName", "lastName", "wow"];

const delay = (ms: number): Promise<void> =>
	new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, ms);
	});

export function Dynamic(): ReactElement {
	const [submittedValues, setSubmittedValues] = useState<Record<
		string,
		any
	> | null>(null);

	const onSubmit = async (
		values: Record<string, any>,
	): Promise<Record<string, any> | null> => {
		setSubmittedValues(null);

		await delay(800);

		setSubmittedValues(values);

		return null;
	};

	return (
		<>
			<Form
				getFieldSchema={getFieldSchema}
				getFieldType={getFieldType}
				names={names}
				onSubmit={onSubmit}
			>
				{({ handleSubmit, submitting }): ReactNode => (
					<form onSubmit={handleSubmit}>
						<FormField name="firstName" />
						<FormField name="lastName" />
						<FormField name="wow" />

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
