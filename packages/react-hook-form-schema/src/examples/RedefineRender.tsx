import type { GetFieldSchema, NameType } from "@vtaits/form-schema";
import { type ReactElement, useState } from "react";
import {
	type FieldSchemaWithRenderBase,
	type FieldType,
	type GetFieldType,
	useFormSchema,
} from "../core";

type InputSchema = FieldSchemaWithRenderBase & {
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

		render: ({ name }, { register }) => (
			<fieldset>
				<legend>Last name</legend>

				<textarea placeholder="Last name" {...register(name)} />
			</fieldset>
		),
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

export function RedefineRender(): ReactElement {
	const [submittedValues, setSubmittedValues] = useState<Record<
		string,
		any
	> | null>(null);

	const onSubmit = async (
		values: Record<string, any>,
	): Promise<Record<string, any> | null> => {
		setSubmittedValues(null);

		await delay(400);

		setSubmittedValues(values);
		return null;
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
