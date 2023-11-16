import type { GetFieldSchema } from "@vtaits/form-schema";
import {
	type FieldType,
	Form,
	FormField,
	type GetFieldType,
} from "@vtaits/react-final-form-schema";
import { type ReactElement, type ReactNode, useState } from "react";
import { useField } from "react-final-form";

type InputSchema = {
	type: "input";
	label?: string;
	placeholder?: string;
	required?: boolean;
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

		serializer: ({ values, name }) => {
			const value = values[name];

			return {
				[name]: value || "",
			};
		},

		parser: ({ values, name }) => {
			const value = values[name];

			return {
				[name]: value || "",
			};
		},

		validatorBeforeSubmit: ({
			values,
			name,
			parents,
			fieldSchema: { required },
			setError,
		}) => {
			if (required && !values[name]) {
				setError(name, parents, "This field is required");
			}

			return {};
		},
	},
};

const getFieldType: GetFieldType<InputSchema> = ({ type }) => fieldTypes[type];

const fullSchema: Record<string, InputSchema> = {
	animalRequired: {
		type: "input",
		label: "Animal (required)",
		required: true,
	},

	animalNotRequired: {
		type: "input",
		label: "Animal (not required)",
	},
};

const getFieldSchema: GetFieldSchema<InputSchema> = (fieldName) =>
	fullSchema[fieldName];

const names = ["animalRequired", "animalNotRequired"];

const delay = (ms: number): Promise<void> =>
	new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, ms);
	});

export function ValidateBeforeSubmit(): ReactElement {
	const [submittedValues, setSubmittedValues] = useState<Record<
		string,
		any
	> | null>(null);

	const onSubmit = async (values: Record<string, any>): Promise<void> => {
		await delay(800);

		setSubmittedValues(values);
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
						<FormField name="animalRequired" />
						<FormField name="animalNotRequired" />

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
