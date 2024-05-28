import type { GetFieldSchema, NameType } from "@vtaits/form-schema";
import { type ReactElement, type ReactNode, useState } from "react";
import { useField } from "react-final-form";
import { type FieldType, Form, FormField, type GetFieldType } from "../core";

type InputSchema = {
	type: "input";
	label?: string;
	placeholder?: string;
};

type InputProps = {
	name: string;

	fieldSchema: InputSchema;
};

function InputComponent({
	name,

	fieldSchema: { label, placeholder },
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

const fieldTypes: Record<string, FieldType<InputSchema>> = {
	input: {
		component: InputComponent,
	},
};

const getFieldType: GetFieldType<InputSchema> = ({ type }) => fieldTypes[type];

const fullSchema: Record<string, InputSchema> = {
	firstName: {
		type: "input",
		label: "First name",
		placeholder: "Input your first name",
	},

	lastName: {
		type: "input",
		label: "Last name",
		placeholder: "Input your last name",
	},
};

const getFieldSchema: GetFieldSchema<InputSchema> = (fieldName: NameType) =>
	fullSchema[fieldName];

const names = ["firstName", "lastName"];

const delay = (ms: number): Promise<void> =>
	new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, ms);
	});

export function Simple(): ReactElement {
	const [submittedValues, setSubmittedValues] = useState<Record<
		string,
		any
	> | null>(null);

	const onSubmit = async (
		values: Record<string, any>,
	): Promise<Record<string, any> | null> => {
		setSubmittedValues(null);

		await delay(800);

		const errors: Record<string, any> = {};

		if (!values.firstName) {
			errors.firstName = "This field is required";
		}

		if (!values.lastName) {
			errors.lastName = "This field is required";
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
				getFieldSchema={getFieldSchema}
				getFieldType={getFieldType}
				names={names}
				onSubmit={onSubmit}
			>
				{({ handleSubmit, submitting }): ReactNode => (
					<form onSubmit={handleSubmit}>
						<FormField name="firstName" />
						<FormField name="lastName" />

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
