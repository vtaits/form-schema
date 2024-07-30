import Button from "@mui/material/Button";
import type { OnChange } from "@vtaits/form-schema/fields/base";
import type { FormApi } from "@vtaits/react-hook-form-schema/fields/base";
import {
	type DefaultFieldSchema,
	Form,
} from "@vtaits/react-hook-form-schema/form";
import { type ReactElement, useState } from "react";

const schemas: Record<string, DefaultFieldSchema<unknown>> = {
	checkbox: {
		type: "checkbox",
		checkboxLabel: "Checkbox",
	},

	checkboxGroup: {
		type: "checkboxGroup",
		label: "Checkbox group",
		options: [
			{
				value: "value1",
				label: "Label 1",
			},
			{
				value: "value2",
				label: "Label 2",
			},
			{
				value: "value3",
				label: "Label 3",
			},
		],
	},

	date: {
		type: "date",
	},

	datetime: {
		type: "datetime",
		serverDateFormat: "yyyy-MM-dd HH:mm",
	},

	input: {
		type: "input",
		label: "Input",
		placeholder: "Input",
		options: ["foo", "bar"],
		autoFocus: true,
	},

	number: {
		type: "input",
		label: "Number",
		isNumber: true,
		placeholder: "Numeric input",
		options: ["123", "456"],
	},

	multiSelect: {
		type: "multiSelect",
		label: "Multi select",
		placeholder: "Multi select",
		options: [
			{
				value: "value1",
				label: "Label 1",
			},
			{
				value: "value2",
				label: "Label 2",
			},
			{
				value: "value3",
				label: "Label 3",
			},
		],
	},

	radioGroup: {
		type: "radioGroup",
		label: "Radio group",
		options: [
			{
				value: "value1",
				label: "Label 1",
			},
			{
				value: "value2",
				label: "Label 2",
			},
			{
				value: "value3",
				label: "Label 3",
			},
		],
	},

	select: {
		type: "select",
		label: "Select",
		placeholder: "Select",
		options: [
			{
				value: "value1",
				label: "Label 1",
			},
			{
				value: "value2",
				label: "Label 2",
			},
			{
				value: "value3",
				label: "Label 3",
			},
		],
	},

	tags: {
		type: "tags",
		label: "Tags",
		options: ["foo", "bar"],
	},

	textarea: {
		type: "textarea",
		label: "Textarea",
		placeholder: "Textarea",
	},
};

const schemasWithClones = Object.entries(schemas).reduce<
	Record<string, DefaultFieldSchema<unknown>>
>((res, [fieldName, schema]) => {
	res[fieldName] = {
		...(schema as Record<string, unknown>),
		onChange: (({ setValue }, nextValue) => {
			setValue(`${fieldName}_cloned`, nextValue);
		}) satisfies OnChange<FormApi, unknown>,
	} as DefaultFieldSchema<unknown>;

	res[`${fieldName}_cloned`] = schema;

	return res;
}, {});

const delay = (ms: number): Promise<void> =>
	new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, ms);
	});

export function OnChangeExample(): ReactElement {
	const [submittedValues, setSubmittedValues] = useState<Record<
		string,
		any
	> | null>(null);

	const onSubmit = async (values: Record<string, any>): Promise<null> => {
		setSubmittedValues(null);

		await delay(400);

		setSubmittedValues(values);

		return null;
	};

	return (
		<>
			<Form
				schemas={schemasWithClones}
				onSubmit={onSubmit}
				renderActions={({ isSubmitting }) => (
					<Button variant="contained" type="submit" disabled={isSubmitting}>
						Submit
					</Button>
				)}
				title="Mui integraion form"
			/>

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
