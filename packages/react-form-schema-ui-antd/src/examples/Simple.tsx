import { Form } from "@vtaits/react-hook-form-schema/form";
import { Button } from "antd";
import { type ReactElement, useState } from "react";
import { AntdProvider } from "..";

const schemas: Record<string, any> = {
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

	list: {
		type: "list",
		label: "List",
		getBlockLabel: (index: number) => `Block #${index + 1}`,
		initialItem: "Initial",
		itemSchema: {
			label: "Input",
			type: "input",
		},
	},

	setList: {
		type: "list",
		label: "List of sets",
		getBlockLabel: (index: number) => `Block #${index + 1}`,
		itemSchema: {
			type: "set",
			nested: true,
			schemas: {
				checkbox: {
					type: "checkbox",
					checkboxLabel: "Checkbox",
				},

				date: {
					label: "Date",
					type: "date",
				},
			},
		},
	},

	multiSelect: {
		type: "multiSelect",
		label: "Mulit select",
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

		for (const [key, value] of Object.entries(values)) {
			if (!value) {
				errors[key] = "This field is required";
			}
		}

		if (Object.keys(errors).length === 0) {
			setSubmittedValues(values);
			return null;
		}

		errors.error = "There are errors in the form";

		return errors;
	};

	return (
		<AntdProvider>
			<Form
				schemas={schemas}
				onSubmit={onSubmit}
				renderActions={({ isSubmitting }) => (
					<Button type="primary" htmlType="submit" disabled={isSubmitting}>
						Submit
					</Button>
				)}
				title="Antd integraion form"
			/>

			{submittedValues && (
				<>
					<hr />

					<h3>Submitted values:</h3>

					<pre>{JSON.stringify(submittedValues, null, 2)}</pre>
				</>
			)}
		</AntdProvider>
	);
}
