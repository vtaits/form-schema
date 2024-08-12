import type { FieldSchemaBase, GetFieldSchema } from "@vtaits/form-schema";
import { type ReactElement, type ReactNode, useState } from "react";
import { useField } from "react-final-form";
import Select from "react-select";
import {
	type FieldType,
	Form,
	FormField,
	type GetFieldType,
	useValuesReady,
} from "../core";

type Option = {
	value: number;
	label: string;
};

type Options = Option[];

type SelectSchema = FieldSchemaBase & {
	type: "select";
	label?: string;
	options: Options;
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

	const isValuesReady = useValuesReady();

	return (
		<div>
			{label && <p>{label}</p>}

			<Select
				isClearable
				isLoading={!isValuesReady}
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
					<li>{submitError}</li>
				</ul>
			)}
		</div>
	);
}

const fieldTypes: Record<string, FieldType<SelectSchema>> = {
	select: {
		component: SelectComponent,

		serializer: ({ values, name }) => {
			const value = values[name];

			return {
				[name]: value ? value.value : null,
			};
		},

		parser: async ({ values, name, fieldSchema: { options } }) => {
			const value = values[name];

			await new Promise((resolve) => {
				setTimeout(() => {
					resolve(undefined);
				}, 500);
			});

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
	},
};

const getFieldType: GetFieldType<SelectSchema> = ({ type }) => fieldTypes[type];

const fullSchema: Record<string, SelectSchema> = {
	animal: {
		type: "select",
		label: "Animal",

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

const names = ["animal"];

const delay = (ms: number): Promise<void> =>
	new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, ms);
	});

const initialValues = {
	animal: 2,
};

const initialValuesPlaceholder = {
	animal: {
		value: null,
		label: "Placeholder animal",
	},
};

export function SerializerAndParser(): ReactElement {
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
				initialValues={initialValues}
				initialValuesPlaceholder={initialValuesPlaceholder}
				getFieldSchema={getFieldSchema}
				getFieldType={getFieldType}
				names={names}
				onSubmit={onSubmit}
			>
				{({ handleSubmit, submitting }): ReactNode => (
					<form onSubmit={handleSubmit}>
						<FormField name="animal" />

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
