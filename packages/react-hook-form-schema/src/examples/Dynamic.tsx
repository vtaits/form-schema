import type { GetFieldSchema } from "@vtaits/form-schema";
import {
	type FieldType,
	type GetFieldType,
	useFormSchema,
} from "@vtaits/react-hook-form-schema";
import {
	type DynamicSchema,
	dynamic,
} from "@vtaits/react-hook-form-schema/fields/dynamic";
import { type SetSchema, set } from "@vtaits/react-hook-form-schema/fields/set";
import { type ReactElement, useState } from "react";

type InputSchema = {
	type: "input";
	label?: string;
	placeholder?: string;
	disabled?: boolean;
};

type FieldSchema =
	| InputSchema
	| (DynamicSchema<InputSchema | SetSchema<any>> & {
			type: "dynamic";
	  })
	| (SetSchema<any> & {
			type: "set";
	  });

const fieldTypes: Record<string, FieldType<any>> = {
	input: {
		render: ({ name, fieldSchema }, { formState: { errors }, register }) => {
			const { label, placeholder } = fieldSchema as InputSchema;

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

		serializer: ({ name, values }) => ({
			[name]: values[name] || "",
		}),
	},

	dynamic,

	set,
};

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
				type: "set",

				schemas: {
					wow: {
						type: "input",
						label: "WOW",
						placeholder: "WOW",
					},

					owo: {
						type: "input",
						label: "OWO",
						placeholder: "OWO",
					},
				},
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
				{renderField("wow")}

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
