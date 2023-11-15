import type { GetFieldSchema } from "@vtaits/form-schema";
import {
	type FieldType,
	type GetFieldType,
	useFormSchema,
} from "@vtaits/react-hook-form-schema";
import { type ReactElement, useState } from "react";

type InputSchema = {
	type: "input";
	label?: string;
	placeholder?: string;
};

const fieldTypes: Record<string, FieldType<InputSchema>> = {
	input: {
		render: (
			{ name, fieldSchema: { label, placeholder } },
			{ formState: { errors }, register },
		) => {
			const error = errors[name];

			return (
				<div>
					{label && <p>{label}</p>}

					<p>
						<input placeholder={placeholder || ""} {...register(name)} />
					</p>

					{error && (
						<ul
							style={{
								color: "red",
							}}
						>
							<li>{error.message as string}</li>
						</ul>
					)}
				</div>
			);
		},
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

const getFieldSchema: GetFieldSchema<InputSchema> = (fieldName: string) =>
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

		await delay(1000);

		const errors: Record<string, any> = {};

		if (!values.firstName) {
			errors.firstName = ["This field is required"];
		}

		if (!values.lastName) {
			errors.lastName = ["This field is required"];
		}

		if (Object.keys(errors).length === 0) {
			setSubmittedValues(values);
			return null;
		}

		return errors;
	};

	const {
		formState: { isSubmitting },
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
				{renderField("firstName")}
				{renderField("lastName")}

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
