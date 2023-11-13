import type { GetFieldSchema } from "@vtaits/form-schema";
import {
	type FieldType,
	Form,
	FormField,
	type GetFieldType,
} from "@vtaits/react-final-form-schema";
import { type ReactElement, type ReactNode, useState } from "react";
import { useField } from "react-final-form";
import Select from "react-select";

type Option = {
	value: number;
	label: string;
};

type Options = Option[];

type SelectSchema = {
	type: "select";
	label?: string;
	options: Options;
	required?: boolean;
};

type SelectProps = {
	name: string;
	fieldSchema: SelectSchema;
};

function SelectComponent({
	name,

	fieldSchema: { label, options },
}: SelectProps): ReactElement {
	const {
		input: { value, onChange },

		meta: { dirtySinceLastSubmit, submitError },
	} = useField(name);

	return (
		<div>
			{label && <p>{label}</p>}

			<Select
				isClearable
				name={name}
				value={value || null}
				options={options}
				onChange={onChange}
			/>

			{!dirtySinceLastSubmit && submitError && (
				<ul
					style={{
						color: "red",
					}}
				>
					{submitError.map((message, index) => (
						<li key={index}>{message}</li>
					))}
				</ul>
			)}
		</div>
	);
}

const fieldTypes: Record<string, FieldType<SelectSchema>> = {
	select: {
		component: SelectComponent,

		serializer: (values, name) => {
			const value = values[name];

			return {
				[name]: value ? value.value : null,
			};
		},

		parser: (values, name, { options }) => {
			const value = values[name];

			return {
				[name]: value
					? options.find((option) => {
							if (option.value === value) {
								return true;
							}

							return false;
					  })
					: null,
			};
		},

		validatorBeforeSubmit: (values, name, { required }) => {
			if (required && !values[name]) {
				return {
					[name]: ["This field is required."],
				};
			}

			return {};
		},
	},
};

const getFieldType: GetFieldType<SelectSchema> = ({ type }) => fieldTypes[type];

const fullSchema = {
	animalRequired: {
		type: "select",
		label: "Animal (required)",
		required: true,

		options: [
			{
				value: 1,
				label: "Cat",
			},

			{
				value: 2,
				label: "Dog",
			},

			{
				value: 3,
				label: "Elephant",
			},

			{
				value: 4,
				label: "Cow",
			},
		],
	},

	animalNotRequired: {
		type: "select",
		label: "Animal (not required)",

		options: [
			{
				value: 1,
				label: "Cat",
			},

			{
				value: 2,
				label: "Dog",
			},

			{
				value: 3,
				label: "Elephant",
			},

			{
				value: 4,
				label: "Cow",
			},
		],
	},
};

const getFieldSchema: GetFieldSchema<SelectSchema> = (fieldName) =>
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
		await delay(1000);

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
