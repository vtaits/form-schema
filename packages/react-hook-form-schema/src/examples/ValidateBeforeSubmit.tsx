import type { GetFieldSchema } from "@vtaits/form-schema";
import { type ReactElement, useState } from "react";
import { type FieldType, type GetFieldType, useFormSchema } from "../core";

type InputSchema = {
	type: "input";
	label?: string;
	placeholder?: string;
	required?: boolean;
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
			setError,
			values,
			name,
			fieldSchema: { required },
			parents,
		}) => {
			if (required && !values[name]) {
				setError(name, parents, ["This field is required"]);
			}
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
				{renderField("animalRequired")}
				{renderField("animalNotRequired")}

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
