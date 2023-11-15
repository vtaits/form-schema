import type { GetFieldSchema } from "@vtaits/form-schema";
import {
	type FieldType,
	type GetFieldType,
	useFormSchema,
} from "@vtaits/react-hook-form-schema";
import { type ReactElement, useState } from "react";
import { Controller } from "react-hook-form";
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

const fieldTypes: Record<string, FieldType<SelectSchema>> = {
	select: {
		render: (
			{ fieldSchema: { label, options }, name },
			{ control, formState: { errors } },
		) => {
			const error = errors[name];

			return (
				<div>
					{label && <p>{label}</p>}

					<Controller
						control={control}
						name={name}
						render={({ field: { value, onChange } }) => (
							<Select
								isClearable
								options={options}
								name={name}
								value={value}
								onChange={onChange}
							/>
						)}
					/>

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
				[name]: value ? value.value : null,
			};
		},

		parser: ({ values, name, fieldSchema: { options } }) => {
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

		validatorBeforeSubmit: ({
			setError,
			values,
			name,
			fieldSchema: { required },
			getFieldSchema,
			getFieldType,
			parents,
		}) => {
			if (required && !values[name]) {
				setError(name, parents, ["This field is required."]);
			}
		},
	},
};

const getFieldType: GetFieldType<SelectSchema> = ({ type }) => fieldTypes[type];

const fullSchema: Record<string, SelectSchema> = {
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
